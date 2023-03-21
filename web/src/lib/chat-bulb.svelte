<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { darkmode } from "./store";

  let hljs = null;
  export let content = "";

  onMount(async () => {
    try {
      hljs = (await import("highlight.js/lib/common")).default;
    } catch (e) {
      hljs = null;
    }
  });

  darkmode.subscribe(async (d) => {
    if (!d) {
      // light mode
      await import("highlight.js/styles/github.css");
      await import("github-markdown-css/github-markdown-light.css");
    } else {
      // dark mode
      await import("highlight.js/styles/github-dark.css");
      await import("github-markdown-css/github-markdown-dark.css");
    }
  });

  // Set options
  // `highlight` example uses https://highlightjs.org
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
      // if (lang && lang !== "") {
      //   // console.log("code blocks language detected:", lang);
      //   const language = hljs.getLanguage(lang) ? lang : "plaintext";
      //   return hljs.highlight(code, { language }).value;
      // }
      // console.warn("code blocks language NOT detected");
      return `${hljs.highlightAuto(code).value}`;
    },
    langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false,
  });
</script>

<div class="flex flex-row w-full my-4">
  <div class="items-start pr-8 md:pr-24 max-w-full md:max-w-3xl">
    <div class="dark:bg-stone-800 bg-neutral-100 rounded-xl px-3 py-2">
      <div class="markdown-body break-words break-all dark:text-neutral-200 ">
        {#if content && content !== ""}
          {@html marked.parse(content)}
        {:else}
          <p>正在加载</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .markdown-body {
    @apply bg-transparent;
  }
  :global(pre) {
    @apply my-2;
  }
</style>
