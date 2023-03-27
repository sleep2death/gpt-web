<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  import markedLinkifyIt from "marked-linkify-it";
  import { _ } from "svelte-i18n";

  let hljs = null;
  export let content = "";

  onMount(async () => {
    try {
      hljs = (await import("highlight.js/lib/common")).default;
    } catch (e) {
      hljs = null;
    }
  });

  const schemas = {};
  const options = {};
  marked.use(markedLinkifyIt(schemas, options));

  marked.setOptions({
    highlight: function (code, lang) {
      if (hljs) {
        return hljs.highlightAuto(code).value;
      }
    },
    langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
  });
</script>

<div class="flex flex-row w-full my-4">
  <div class="items-start pr-8 md:pr-24 max-w-full md:max-w-3xl">
    <div
      class="dark:bg-stone-800 bg-white rounded-xl px-3 py-2 markdown-content"
    >
      <div class="markdown-body break-words break-all dark:text-neutral-200">
        {#if content && content !== ""}
          {@html marked.parse(content)}
        {:else}
          <p>{$_("loading")}</p>
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
