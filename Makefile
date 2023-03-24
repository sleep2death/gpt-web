GOCMD=go
GOTEST=$(GOCMD) test
GOVET=$(GOCMD) vet
BINARY_NAME=gpt_web
ENTRY=cmd/main.go
VERSION?=0.0.0
SERVICE_PORT?=3000
DOCKER_REGISTRY?= #if set it should finished by /
EXPORT_RESULT?=false # for CI please set EXPORT_RESULT to true

WEB_DIR :=./web

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

.PHONY: all test build vendor

all: clean prepare build zip

prepare:
	mkdir -p out
	yarn --cwd ./web
	yarn --cwd ./web build

	mkdir -p out/web
	cp -r ./web/dist out/web/dist
	## copy .env file
	cp .env.example out/.env.example
	## build go binary
	$(GOCMD) mod tidy

## Build:
build: ## Build your project and put the output binary in out
	## $(GOCMD) build -o out/$(BINARY_NAME) cmd/main.go
	GOARCH=amd64 GOOS=darwin  go build -o out/${BINARY_NAME}-darwin-amd64      $(ENTRY)
	GOARCH=arm64 GOOS=darwin  go build -o out/${BINARY_NAME}-darwin-arm64      $(ENTRY)
	GOARCH=amd64 GOOS=linux   go build -o out/${BINARY_NAME}-linux-amd64       $(ENTRY)
	GOARCH=arm64 GOOS=linux   go build -o out/${BINARY_NAME}-linux-arm64       $(ENTRY)
	GOARCH=amd64 GOOS=windows go build -o out/${BINARY_NAME}-windows-amd64.exe $(ENTRY)

zip:
	tar -zcvf out/${BINARY_NAME}-darwin-amd64.tar.gz      -C out ${BINARY_NAME}-darwin-amd64      web
	tar -zcvf out/${BINARY_NAME}-darwin-arm64.tar.gz      -C out ${BINARY_NAME}-darwin-arm64      web 
	tar -zcvf out/${BINARY_NAME}-linux-amd64.tar.gz       -C out ${BINARY_NAME}-linux-amd64       web 
	tar -zcvf out/${BINARY_NAME}-linux-arm64.tar.gz       -C out ${BINARY_NAME}-linux-arm64       web 

	zip -r out/${BINARY_NAME}-windows-amd64.zip  out/${BINARY_NAME}-windows-amd64.exe out/web

docker:
	docker build -t gpt-web .

clean: ## Remove build related file
	rm -rf out/${BINARY_NAME}-* out/web out/main web/dist
	rm -f ./junit-report.xml checkstyle-report.xml ./coverage.xml ./profile.cov yamllint-checkstyle.xml

dev:
	yarn --cwd ./web dev & PIDYARN=$!
	wait $PIDYARN
	go run cmd/main.go & PIDGO=$!
	wait $PIDGO

## Test:
test: ## Run the tests of the project
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/jstemmer/go-junit-report
	$(eval OUTPUT_OPTIONS = | tee /dev/tty | go-junit-report -set-exit-code > junit-report.xml)
endif
	$(GOTEST) -v -race ./... $(OUTPUT_OPTIONS)

coverage: ## Run the tests of the project and export the coverage
	$(GOTEST) -cover -covermode=count -coverprofile=profile.cov ./...
	$(GOCMD) tool cover -func profile.cov
ifeq ($(EXPORT_RESULT), true)
	GO111MODULE=off go get -u github.com/AlekSi/gocov-xml
	GO111MODULE=off go get -u github.com/axw/gocov/gocov
	gocov convert profile.cov | gocov-xml > coverage.xml
endif
