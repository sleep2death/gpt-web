import mdit from "markdown-it";

import { writable, get } from "svelte/store";
import { themeChange } from "theme-change";

export const lightmode = writable(localStorage.theme !== "delight");

export const markdown_css = writable("");
export const highlight_css = writable("");

export const input = writable("")
export const bottom = writable(false)

lightmode.subscribe(async l => {
  if (l) {
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

export let mdi = null;
let hljs = null

export async function init() {
  themeChange(false)

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

export const state = writable("idle")
export const error = writable("")

let xunfeiURL = ""
let recorder = null
let tempText = ""

import IatRecorder from "./recorder";

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

export function abortTranscoding() {
  recorder.forceStop()
}
