package gpt_web

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"

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

	return &Config{
		Key:       key,
		Proxy:     proxy,
		Host:      host,
		CHAT_API:  capi,
		SPEAK_API: sapi,
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

func getSpeakHandler(conf *Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := c.FormFile("audio-file")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"msg": err.Error()})
			return
		}

		c.SaveUploadedFile(file, file.Filename)
		fmt.Println("file received:", file.Filename, file.Size)
		c.JSON(http.StatusOK, gin.H{})
	}
}
