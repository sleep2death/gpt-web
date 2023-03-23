package gpt_web

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

type TestResponseRecorder struct {
	*httptest.ResponseRecorder
	closeChannel chan bool
}

func (r *TestResponseRecorder) CloseNotify() <-chan bool {
	return r.closeChannel
}

func CreateTestResponseRecorder() *TestResponseRecorder {
	return &TestResponseRecorder{
		httptest.NewRecorder(),
		make(chan bool, 1),
	}
}

func TestServer(t *testing.T) {
	msg := NewMessage(System, "Can you write me some golang code?")
	req := Request{
		Messages: []Message{msg},
	}

	engine := createRouter(FromEnv())

	// Convert the payload to JSON
	payload, err := json.Marshal(req)
	if err != nil {
		t.Fatal(err)
	}

	// Create a new test request with the JSON payload
	r, err := http.NewRequest(http.MethodPost, "/texthero/chat", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatal(err)
	}

	// Set the Content-Type header to application/json
	r.Header.Set("Content-Type", "application/json")

	// Create a new test response recorder
	recorder := CreateTestResponseRecorder()

	// Perform the request
	engine.ServeHTTP(recorder, r)
	assert.Equal(t, http.StatusOK, recorder.Code)

	t.Log(recorder.Body.String())
}
