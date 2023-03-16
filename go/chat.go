package texthero

import (
	"bufio"
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

type Role int

const (
	System Role = iota
	User
	Assistant

	MODEL string = "gpt-3.5-turbo"
	API   string = "https://api.openai.com/v1/chat/completions"
)

var (
	ErrEmptyKey      error = errors.New("empty api key")
	ErrEmptyMessages error = errors.New("too many empty messages")
)

func (r Role) String() string {
	return [...]string{"system", "user", "assistant"}[r]
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`

	// maybe not working: https://github.com/openai/openai-python/blob/main/chatml.md
	Name string `json:"name,omitempty"`
}

func (msg Message) String() string {
	return fmt.Sprintf("%s: %s", msg.Role, msg.Content)
}

func NewMessage(role Role, content string) (msg Message) {
	msg = Message{
		Role:    role.String(),
		Content: content,
	}
	return
}

type Request struct {
	Messages         []Message      `json:"messages"`
	Model            string         `json:"model,omitempty"`
	MaxTokens        int            `json:"max_tokens,omitempty"`
	Temperature      float32        `json:"temperature,omitempty"`
	TopP             float32        `json:"top_p,omitempty"`
	N                int            `json:"n,omitempty"`
	Stream           bool           `json:"stream,omitempty"`
	Stop             []string       `json:"stop,omitempty"`
	PresencePenalty  float32        `json:"presence_penalty,omitempty"`
	FrequencyPenalty float32        `json:"frequency_penalty,omitempty"`
	LogitBias        map[string]int `json:"logit_bias,omitempty"`
	User             string         `json:"user,omitempty"`
}

type ChatCompletionStreamChoiceDelta struct {
	Content string `json:"content"`
}

type ChatCompletionStreamChoice struct {
	Index        int                             `json:"index"`
	Delta        ChatCompletionStreamChoiceDelta `json:"delta"`
	FinishReason string                          `json:"finish_reason"`
}

type ChatCompletionStream struct {
	ID      string                       `json:"id"`
	Object  string                       `json:"object"`
	Created int64                        `json:"created"`
	Model   string                       `json:"model"`
	Choices []ChatCompletionStreamChoice `json:"choices"`
}

// APIError provides error information returned by the OpenAI API.
type APIError struct {
	Message string  `json:"message"`
	Type    string  `json:"type"`
	Param   *string `json:"param,omitempty"`
	Code    *string `json:"code,omitempty"`
	Stream  bool    `json:"stream,omitempty"`
}

func (e *APIError) Error() string {
	return e.Message
}

type ErrorResponse struct {
	StatusCode int
	Err        *APIError `json:"error,omitempty"`
}

// https://platform.openai.com/docs/guides/error-codes/api-errors
func (er ErrorResponse) Error() string {
	errMsg := strings.ToLower(er.Err.Message)
	switch er.StatusCode {
	case 401:
		if strings.Contains(errMsg, "invalid authentication") {
			return "err.openai.invalid_auth"
		} else if strings.Contains(errMsg, "incorrect api key") {
			return "err.openai.incorrect_key"
		} else if strings.Contains(errMsg, "must be a member") {
			return "err.openai.not_member"
		}
	case 429:
		if strings.Contains(errMsg, "rate limit") {
			return "err.openai.rate_limit"
		} else if strings.Contains(errMsg, "current quota") {
			return "err.openai.billing"
		} else if strings.Contains(errMsg, "overloaded") {
			return "err.openai.overloaded"
		}
	case 500:
		return "err.openai.server_error"
	}
	return "err.openai.not_found"
}

// RequestError provides informations about generic request errors.
type RequestError struct {
	StatusCode int
	Err        error
}

func (conf *Config) Chat(ctx context.Context, req Request) (msgChan chan string, errChan chan error, err error) {
	// only support stream request
	req.Stream = true

	// only 3.5 turbo suppored
	req.Model = MODEL

	// Marshal the request body into JSON bytes
	reqBytes, err := json.Marshal(req)
	if err != nil {
		return nil, nil, err
	}

	// Create a new HTTP request with the JSON body
	request, err := http.NewRequestWithContext(ctx, "POST", API, bytes.NewBuffer(reqBytes))
	if err != nil {
		return nil, nil, err
	}

	// Set the authorization and content-type headers
	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", conf.Key))
	request.Header.Set("Content-Type", "application/json")

	// steam
	request.Header.Set("Accept", "text/event-stream")
	request.Header.Set("Cache-Control", "no-cache")
	request.Header.Set("Connection", "keep-alive")

	client := &http.Client{}
	if conf.Proxy != "" {
		// get proxy from dot env
		proxy, err := url.Parse(conf.Proxy)
		if err != nil {
			return nil, nil, err
		}
		tr := &http.Transport{
			Proxy:           http.ProxyURL(proxy),                  // 设置代理地址
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, // 忽略证书验证
		}
		client.Transport = tr
	}

	// Send the request and get the response
	resp, err := client.Do(request)
	if err != nil {
		fmt.Println("[NETWORK ERROR]:", err.Error())
		return nil, nil, err
	}

	// handle the errors seperately
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusBadRequest {
		var errRes ErrorResponse

		// Read and print the response body
		respBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, nil, err
		}

		err = json.Unmarshal(respBytes, &errRes)
		if err != nil {
			return nil, nil, fmt.Errorf("%d", http.StatusInternalServerError)
		}
		errRes.StatusCode = resp.StatusCode
		fmt.Println("[OPENAI ERROR]", errRes.StatusCode, errRes.Err.Message)
		return nil, nil, errRes
	}

	msgChan = make(chan string)
	errChan = make(chan error)

	go func() {
		defer resp.Body.Close()
		defer close(msgChan)
		defer close(errChan)

		var headerData = []byte("data: ")
		reader := bufio.NewReader(resp.Body)
		var emptyMessagesCount uint

		for {
			line, err := reader.ReadBytes('\n')
			if err != nil {
				errChan <- err
				break
			}
			line = bytes.TrimSpace(line)

			if !bytes.HasPrefix(line, headerData) {
				emptyMessagesCount++
				if emptyMessagesCount > 300 {
					fmt.Println("too many empty messages")
					errChan <- ErrEmptyMessages
					break
				}
				continue
			}
			line = bytes.TrimPrefix(line, headerData)
			if string(line) == "[DONE]" {
				break
			}
			var resp ChatCompletionStream
			err = json.Unmarshal(line, &resp)
			if err != nil {
				errChan <- err
				break
			}

			for _, c := range resp.Choices {
				msgChan <- c.Delta.Content
			}
		}
	}()
	return
}
