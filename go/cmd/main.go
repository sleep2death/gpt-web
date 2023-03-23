package main

import (
	"log"

	gg "github.com/sleep2death/gpt_gin"
)

func main() {
	err := gg.FromToml().Serve()
	if err != nil {
		log.Fatal(err)
	}
}
