<script>
  import { marked } from "marked";
  import hljs from "highlight.js/lib/core";

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDark) {
    import("../../node_modules/highlight.js/styles/github-dark.css");
    import("../../node_modules/github-markdown-css/github-markdown-dark.css");
  } else {
    import("../../node_modules/highlight.js/styles/github.css");
    import("../../node_modules/github-markdown-css/github-markdown-light.css");
  }

  export let content = "";

  // Set options
  // `highlight` example uses https://highlightjs.org
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
      if (lang && lang !== "") {
        // console.log("code blocks language detected:", lang);
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      }
      // console.warn("code blocks language NOT detected");
      return hljs.highlightAuto(code).value;
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
    <div
      class="dark:bg-stone-800 dark:text-neutral-300 bg-white rounded-xl px-3 py-2"
    >
      <div class="markdown-body ">
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
</style>
