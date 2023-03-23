package gpt_web

import (
	"context"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestChat(t *testing.T) {
	msg := NewMessage(System, "Can you write me some golang code?")
	req := Request{
		Messages: []Message{msg},
	}

	msgChan, errChan, err := FromEnv().Chat(context.TODO(), req)
	if err != nil {
		t.Fatal(err)
	}

	var content string
	var errorFromAPI error

	fmt.Println(msg)
	for {
		select {
		case msg, ok := <-msgChan:
			if !ok {
				msgChan = nil
			}
			fmt.Print(msg)
			content += msg
		case err, ok := <-errChan:
			if !ok {
				errChan = nil
			}
			errorFromAPI = err
		}

		if msgChan == nil || errChan == nil {
			break
		}
	}

	assert.Nil(t, errorFromAPI)
	assert.NotEmpty(t, content)
}
