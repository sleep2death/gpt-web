package gpt_gin

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/BurntSushi/toml"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Config struct {
	Key   string `toml:"key, required"`    // your openai api key
	Proxy string `toml:"proxy, omitempty"` // proxy address
	Host  string `toml:"host, omitempty"`  // server host address
}

func (c *Config) Serve() error {
	return createRouter(c).Run(c.Host)
}

func Default(key string) *Config {
	return &Config{
		Key:  key,
		Host: ":8080",
	}
}

func FromToml() (conf *Config) {
	_, err := toml.DecodeFile("./config.toml", &conf)
	fmt.Println(conf)
	if err != nil {
		panic(err)
	}

	if conf.Key == "" {
		panic(ErrEmptyKey)
	}
	return
}

// read config keys in .env file
// TH_KEY=sk-***
// TH_PROXY=127.0.0.1
func FromEnv() *Config {
	if err := godotenv.Load(); err != nil {
		panic(err)
	}

	key := os.Getenv("GG_KEY")
	if key == "" {
		panic(ErrEmptyKey)
	}

	proxy := os.Getenv("GG_PROXY")

	host := os.Getenv("GG_HOST")
	if host == "" {
		host = ":8080"
	}

	path := os.Getenv("GG_PATH")
	if path == "" {
		path = "/gpt-gin/chat"
	}

	return &Config{
		Key:   key,
		Proxy: proxy,
		Host:  host,
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
	r := gin.Default()
	r.Use(CORSMiddleware())
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.Static("/", "../build/public")
	r.POST("/chat", getChatHandler(conf))

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
