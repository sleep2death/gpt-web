package main

import (
	"log"

	gw "github.com/sleep2death/gpt_web"
)

func main() {
	err := gw.FromEnv().Serve()
	if err != nil {
		log.Fatal(err)
	}
}
