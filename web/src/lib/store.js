import { get, writable } from "svelte/store";
import IatRecorder from "./recorder";

import mdit from "markdown-it";
import { addMessages, currentSession, updateLastMessage } from "./store/session";

export const lightmode = writable(localStorage.theme === "light")

export const markdown_css = writable("");
export const highlight_css = writable("");

lightmode.subscribe(async l => {
  console.log("lightmode:", l)
  if (!l) {
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

// if (window.matchMedia &&
//   window.matchMedia('(prefers-color-scheme: dark)').matches) {
//   lightmode.set(false)
// }

// drawer toggle
export const drawer = writable(false)

// input value in textarea
export const input = writable("")
input.subscribe(i => {
  input.set(html2text(i.trim()))
})

// state of the sending status
export const state = writable("idle")

// all messages
export const session = writable({ label: "", id: Date.now(), messages: [] })

// error text
export const error = writable("")

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

export async function send() {
  let content = get(input)
  if (content === "") {
    return
  }

  // if it's the first message, then set the role to system
  let role = get(session).messages.length === 0 ? "system" : "user"
  addMessages([{ role: role, content: content }, { role: "assistant", content: "" }])

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
      body: JSON.stringify({ top_p, temperature, messages: get(currentSession).messages }), // body data type must match "Content-Type" header
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

      updateLastMessage(incoming)
    }
  } catch (e) {
    console.error(e)
    error.set(`<${response && response.status ? response.status : ""}> <error ${e.toString()}>`)
  } finally {
    state.set("idle")
  }
}

export function abort() {
  const st = get(state)
  if (st === "loading") {
    controller.abort()
  } else if (st === "transcoding") {
    recorder.forceStop()
  }

  state.set("idle")
}

let xunfeiURL = ""
let recorder = null
let tempText = ""

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

  tempText = get(input)
}

export function stopRecord() {
  state.set("transcoding")
  if (recorder) {
    recorder.stop()
  }
}

function onXunfeiData(evt) {
  input.set(tempText + evt.detail)
}

function onXunfeiError(evt) {
  console.error(evt.error)
  recorder.removeEventListener("data", onXunfeiData)
  recorder.removeEventListener("error", onXunfeiError)
  recorder.removeEventListener("close", onXunfeiClose)
}

function onXunfeiClose() {
  state.set("idle")
  recorder.removeEventListener("data", onXunfeiData)
  recorder.removeEventListener("error", onXunfeiError)
  recorder.removeEventListener("close", onXunfeiClose)
  recorder = null
}

function html2text(html) {
  let res = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
  res = res.replace(/<script([\s\S]*?)<\/script>/gi, '');
  res = res.replace(/<\/div>/ig, '\n');
  res = res.replace(/<\/li>/ig, '\n');
  res = res.replace(/<li>/ig, '  *  ');
  res = res.replace(/<\/ul>/ig, '\n');
  res = res.replace(/<\/p>/ig, '\n');
  res = res.replace(/<br\s*[\/]?>/gi, "\n");
  res = res.replace(/<[^>]+>/ig, '');
  return res
}

