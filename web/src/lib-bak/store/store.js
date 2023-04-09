import { writable } from "svelte/store";

export const state = writable("idle")
export const error = writable("")

import mdit from "markdown-it";

export const darkmode = writable(false)
if (window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkmode.set(true)
}

export const markdown_css = writable("");
export const highlight_css = writable("");

darkmode.subscribe(async d => {
  console.log("darkmode:", d)
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
