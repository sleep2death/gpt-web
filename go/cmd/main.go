package main

import (
	"log"

	th "github.com/sleep2death/texthero"
)

func main() {
	err := th.FromEnv().Serve()
	if err != nil {
		log.Fatal(err)
	}
}
