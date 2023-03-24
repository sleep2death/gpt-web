# gpt-web

gpt-web is a browser interface built with [svelte](https://github.com/sveltejs/svelte) and [gin-gonic](https://github.com/gin-gonic/gin) that allows you to interact with the [OpenAI ChatGPT API](https://openai.com/blog/openai-api).
![](./screen-shot.jpeg)

## Features

- Proxy supported for the backend
- Responsive design for mobile devices and Wechat
- Dark mode
- Support for Multiple languages
- Markdown and code highlighting
- Small frontend files (using code splitting and gzip)

## Install and Running

### Using released binaries:

1. Download the zip file for your platform from the [release page](https://github.com/sleep2death/gpt-web/releases). For example, if you're using a Mac with an M1 or M2 chip, download `gpt_web-darwin-arm64.tar.gz`.
1. Unzip the file and navigate to the folder.
1. Edit the `.env.example` file. add your own [OpenAI API Key](https://platform.openai.com/account/api-keys)) and save it as `.env`.
1. Run the binary file.

### Building from source:

1. Prerequest: [nodejs](https://nodejs.org/en), [yarn](https://yarnpkg.com/) and [golang](https://go.dev)
1. Clone the repository: `git@github.com:sleep2death/gpt-web.git`.
1. Navigate to the `gpt-web` directory.
1. Edit the `.env.example` file. add your own [OpenAI API Key](https://platform.openai.com/account/api-keys)) and save it as `.env`.
1. Run `make dev`. If you don't have GNU Make installed, you can run the following commands instead:
   - `yarn --cwd ./web && yarn --cwd ./web build`
   - `go run cmd/main.go`

### From Docker

- Run directly: `docker run -itd --name gpt-web -e GPTW_KEY=YOUR_OPENAI_KEY -p 8081:8081 aspirin2d/gpt-web`
- Run behind the proxy: `docker run -itd --name gpt-web -e GPTW_KEY=YOUR_OPENAI_KEY -p 8081:8081 --add-host=host.docker.internal:host-gateway -e GPTW_PROXY=http://host.docker.internal:7890 aspirin2d/gpt-web`
