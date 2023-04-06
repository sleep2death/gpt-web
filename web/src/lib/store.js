import { get, writable } from "svelte/store";
import IatRecorder from "./recorder";


export const darkmode = writable(false)

if (window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkmode.set(true)
}

// input value in textarea
export const input = writable("")

// state of the sending status
export const state = writable("idle")

// all messages
export const messages = writable([])

// error text
export const error = writable("")

import mdit from "markdown-it";
export let mdi = null;
let hljs = null

export async function init() {
  const hl = (await import("highlight.js/lib/common"));
  hljs = hl.default

  mdi = mdit({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (code, _) => {
      return (
        '<pre class="hljs"><code>' +
        hljs.highlightAuto(code).value +
        "</code></pre>"
      );
    },
  });
}

export const markdown_css = writable("");
export const highlight_css = writable("");

darkmode.subscribe(async d => {
  if (d) {
    const md = await import(
      "github-markdown-css/github-markdown-dark.css?inline"
    );
    const hl = await import("highlight.js/styles/github-dark.css?inline");
    markdown_css.set(md.default);
    highlight_css.set(hl.default);
  } else {
    const md = await import(
      "github-markdown-css/github-markdown-light.css?inline"
    );
    const hl = await import("highlight.js/styles/github.css?inline");
    markdown_css.set(md.default);
    highlight_css.set(hl.default);
  }
})


export async function send() {
  let content = get(input)
  if (content === "") {
    return
  }

  // if it's the first message, then set the role to system
  let role = get(messages).length === 0 ? "system" : "user"
  messages.update(m => [...m, { role: role, content: content }, { role: "assistant", content: "" }])

  // clear input value
  input.set("")

  // do chat
  await chat()
}

let controller = new AbortController()
let signal = controller.signal
let top_p = 0.7
let temperature = 0.1

// chat with server
async function chat() {
  state.set("loading")
  let response

  try {
    // using absolue url if in development mode, using relative url in production mode
    const url = import.meta.env.MODE === "development" ? "http://localhost:8081/api/chat" : "./api/chat"
    response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        "Connection": "keep-alive",
      },
      body: JSON.stringify({ top_p, temperature, messages: get(messages) }), // body data type must match "Content-Type" header
      signal
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.msg)
    }

    const reader = response.body.getReader();
    const dec = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const incoming = dec.decode(value)
      if (incoming.includes("ERROR>>>")) {
        error.set(incoming)
        break
      }
      messages.update(m => { m[m.length - 1].content += incoming; return m })
    }
  } catch (e) {
    console.error(e)
    error.set(`<${response && response.status ? response.status : ""}> <error ${e.toString()}>`)
  } finally {
    state.set("idle")
  }
}

export function abort() {
  controller.abort()
}

let xunfeiURL = ""
let recorder = null

export async function startRecord() {
  const TransWorker = await import("./transcode.worker.js?worker");
  let transWorker = new TransWorker.default();
  // fetch encryped url from server
  if (xunfeiURL === "") {
    const url = import.meta.env.MODE === "development" ? "http://localhost:8081/api/xunfei" : "./api/xunfei"
    const resp = await fetch(url, { method: "POST" })
    const json = await resp.json()
    xunfeiURL = json.url
  }

  recorder = new IatRecorder(xunfeiURL, transWorker);

  recorder.addEventListener("data", onXunfeiData)
  recorder.addEventListener("error", onXunfeiError)
  recorder.addEventListener("close", onXunfeiClose)

  recorder.start()
  state.set("recording")
}

export function stopRecord() {
  state.set("transcoding")
  if (recorder) {
    recorder.stop()
  }
}

export function onXunfeiData(evt) {
  input.set(evt.detail)
}

export function onXunfeiError(evt) {
  console.error(evt.error)
}

export function onXunfeiClose() {
  state.set("idle")
}
