# gpt-web

A browser interface build by [svelte](https://github.com/sveltejs/svelte) and [gin-gonic](https://github.com/gin-gonic/gin) for [OpenAI ChatGPT API](https://openai.com/blog/openai-api).
![](./screen-shot.jpeg)

## Features

- Proxy supported backend
- Responsive for mobile
- Dark mode
- Multiple languages supported
- Markdown and code highlight supported
- Small frontend files (using code splitting and gzip)

## Install and Running

### From released binaries:

1. Choose the zip file from [release page](https://github.com/sleep2death/gpt-web/releases). (eg. for mac m1/m2, choose gpt_web-darwin-arm64.tar.gz)
1. Unzip it to somewhere, and go to the folder.
1. Edit the `.env.example` file. (at least add your own [OpenAI API Key](https://platform.openai.com/account/api-keys)) and save it to `.env`
1. run the binary file.

### From source (development mode):

1. Prerequest: [nodejs](https://nodejs.org/en), [yarn](https://yarnpkg.com/) and [golang](https://go.dev)
2. Git clone: `git@github.com:sleep2death/gpt-web.git`
3. Change directory: `cd gpt-web`
4. Edit the `.env.example` file. (at least add your own [OpenAI API Key](https://platform.openai.com/account/api-keys)) and save it to `.env`
5. Run: `make dev`
6. If you don't have 'GNU make' installed, you can run the following command:
   - `yarn --cwd ./web && yarn --cwd ./web build`
   - `go run cmd/main.go`
