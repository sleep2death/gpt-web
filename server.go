package gpt_web

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Config struct {
	Key       string // your openai api key
	Proxy     string // proxy address
	Host      string // server host port
	CHAT_API  string // chat api path
	SPEAK_API string // speak api path

	XF_API_URL    string
	XF_API_SECRET string
	XF_API_KEY    string
}

func (c *Config) Serve() error {
	fmt.Printf("[GPT-WEB] running on %s | proxy: '%s' | speak-api: '%s', chat-api: '%s' \n", c.Host, c.Proxy, c.SPEAK_API, c.CHAT_API)
	return createRouter(c).Run(c.Host)
}

// read config keys in .env file
// TH_KEY=sk-***
// TH_PROXY=127.0.0.1
func FromEnv() *Config {
	// load .env file if existed
	if err := godotenv.Load(); err != nil {
		fmt.Println(".env file not found, using system enviroment")
	}

	key := os.Getenv("GPTW_KEY")
	if key == "" {
		panic(ErrEmptyKey)
	}

	proxy := os.Getenv("GPTW_PROXY")

	host := os.Getenv("GPTW_HOST")
	if host == "" {
		host = ":8081"
	}

	capi := os.Getenv("GPTW_CHAT_API")
	if capi == "" {
		capi = "/gpt-web/chat"
	}

	sapi := os.Getenv("GPTW_SPEAK_API")
	if sapi == "" {
		sapi = "/gpt-web/speak"
	}

	xf_url := os.Getenv("GPTW_XF_API_URL")
	xf_secret := os.Getenv("GPTW_XF_API_SECRET")
	xf_key := os.Getenv("GPTW_XF_API_KEY")

	return &Config{
		Key:           key,
		Proxy:         proxy,
		Host:          host,
		CHAT_API:      capi,
		SPEAK_API:     sapi,
		XF_API_URL:    xf_url,
		XF_API_SECRET: xf_secret,
		XF_API_KEY:    xf_key,
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func createRouter(conf *Config) *gin.Engine {
	// set to release mode
	gin.SetMode("release")

	r := gin.Default()

	r.Use(CORSMiddleware())
	r.Use(gzip.Gzip(gzip.DefaultCompression))

	r.Static("/", "./web/dist")

	r.POST(conf.CHAT_API, getChatHandler(conf))

	r.POST("/speak", getSpeakHandler(conf))
	r.POST("/xunfei", getWebsocketURL(conf))

	return r
}

func getChatHandler(conf *Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req Request
		if err := c.BindJSON(&req); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"msg": "err.session.parse",
			})
			return
		}

		l := len(req.Messages)
		if l > 1 {
			fmt.Println("REQ:", req.Messages[len(req.Messages)-2])
		}
		//
		// fmt.Println("messages:", req.Messages)
		msgChan, errChan, err := conf.Chat(c.Request.Context(), req)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"msg": err.Error(),
			})
			return
		}

		// c.Header("Content-Type", "text/html; charset=utf-8")
		// c.Writer.WriteHeader(http.StatusOK)
		// c.String(http.StatusOK, "hello")
		c.Stream(func(w io.Writer) bool {
			select {
			case msg, ok := <-msgChan:
				if !ok {
					return false
				}
				outputBytes := bytes.NewBufferString(msg)
				// fmt.Println("output:", outputBytes.String())
				c.Writer.Write(outputBytes.Bytes()) // nolint
				return true
			case err, ok := <-errChan:
				if !ok {
					return false
				}
				outputBytes := bytes.NewBufferString(fmt.Sprintf("ERROR>>> %s", err.Error()))
				c.Writer.Write(outputBytes.Bytes()) //nolint
				return false
			}
		})
	}
}

// xunfei auth url
func assembleAuthUrl(hosturl string, apiKey, apiSecret string) string {
	ul, err := url.Parse(hosturl)
	if err != nil {
		fmt.Println(err)
	}
	//签名时间
	date := time.Now().UTC().Format(time.RFC1123)
	//date = "Tue, 28 May 2019 09:10:42 MST"
	//参与签名的字段 host ,date, request-line
	signString := []string{"host: " + ul.Host, "date: " + date, "GET " + ul.Path + " HTTP/1.1"}
	//拼接签名字符串
	sgin := strings.Join(signString, "\n")
	fmt.Println(sgin)
	//签名结果
	sha := HmacWithShaTobase64("hmac-sha256", sgin, apiSecret)
	fmt.Println(sha)
	//构建请求参数 此时不需要urlencoding
	authUrl := fmt.Sprintf("hmac username=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"", apiKey,
		"hmac-sha256", "host date request-line", sha)
	//将请求参数使用base64编码
	authorization := base64.StdEncoding.EncodeToString([]byte(authUrl))

	v := url.Values{}
	v.Add("host", ul.Host)
	v.Add("date", date)
	v.Add("authorization", authorization)
	//将编码后的字符串url encode后添加到url后面
	callurl := hosturl + "?" + v.Encode()
	return callurl
}

func HmacWithShaTobase64(algorithm, data, key string) string {
	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(data))
	encodeData := mac.Sum(nil)
	return base64.StdEncoding.EncodeToString(encodeData)
}

var hostUrl = "wss://iat-api.xfyun.cn/v2/iat"

func getWebsocketURL(conf *Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"url": assembleAuthUrl(hostUrl, conf.XF_API_KEY, conf.XF_API_SECRET)})
	}
}

func getSpeakHandler(conf *Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("audio-file")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"msg": err.Error()})
			return
		}

		ustr := uuid.New().String()
		fileName := fmt.Sprintf("%s.webm", ustr)

		c.SaveUploadedFile(file, fileName)
		fmt.Println("file received:", fileName)

		c.JSON(http.StatusOK, gin.H{})
	}
}
