package texthero

import (
	"bufio"
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
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

type Config struct {
	Key   string // your openai api key
	Proxy string // "if you have to use proxy to reach openai"
}

func Default(key string) Config {
	return Config{
		Key: key,
	}
}

// read config keys in .env file
// TH_KEY=sk-***
// TH_PROXY=127.0.0.1
func FromEnv() Config {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	key := os.Getenv("TH_KEY")
	if key == "" {
		panic(ErrEmptyKey)
	}

	proxy := os.Getenv("TH_PROXY")

	return Config{
		Key:   key,
		Proxy: proxy,
	}
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
	Model            string         `json:"model"`
	Messages         []Message      `json:"messages"`
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

func (conf Config) Chat(ctx context.Context, req Request) (msgChan chan string, errChan chan error, err error) {
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
		fmt.Println("openai api error:", err.Error())
		return nil, nil, err
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
