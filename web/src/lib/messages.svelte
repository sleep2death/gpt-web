<script>
  import { marked } from "marked";
  // import "highlight.js/styles/default.css";
  // import markdown_dark from "github-markdown-css/github-markdown-dark.css?inline";
  // import markdown_light from "github-markdown-css/github-markdown-light.css?inline";
  //
  // import highlight_dark from "highlight.js/styles/github-dark.css?inline";
  // import highlight_light from "highlight.js/styles/default.css?inline";

  import { onMount } from "svelte";
  import { darkmode } from "./store";

  let hljs = null;

  let markdown_css;
  let highlight_css;

  // darkmode subs, for loading extra css
  darkmode.subscribe(async (d) => {
    if (d) {
      markdown_css = await import(
        "github-markdown-css/github-markdown-dark.css?inline"
      ).default;
      highlight_css = await import("highlight.js/styles/github-dark.css")
        .default;
    } else {
      markdown_css = await import(
        "github-markdown-css/github-markdown-light.css?inline"
      ).default;
      highlight_css = await import("highlight.js/styles/github.css?inline")
        .default;
    }
  });

  onMount(async () => {
    try {
      hljs = (await import("highlight.js/lib/common")).default;
    } catch (e) {
      hljs = null;
    }

    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: function (code, _) {
        if (hljs) {
          return hljs.highlightAuto(code).value;
        }
      },
      langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
    });
  });

  export let messages;
</script>

<svelte:head>
  {@html `<style>${markdown_css}</style>`}
  {@html `<style>${highlight_css}</style>`}
</svelte:head>

<div class="w-full max-w-4xl">
  {#each $messages as msg}
    {#if msg.role === "assistant"}
      <div class="chat chat-start my-4">
        <div class="chat-bubble markdown-body bg-base-100 text-stone-800">
          {@html marked.parse(msg.content)}
        </div>
      </div>
    {:else}
      <div class="chat chat-end">
        <div class="chat-bubble chat-bubble-primary">
          {msg.content}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  @import "highlight.js/styles/default.css";
</style>
