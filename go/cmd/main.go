package main

import (
	"log"

	gg "github.com/sleep2death/gpt_gin"
)

func main() {
	err := gg.FromEnv().Serve()
	if err != nil {
		log.Fatal(err)
	}
}
