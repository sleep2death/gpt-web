<script>
  export let messages;
  import { markdown_css, highlight_css, mdi } from "./store";
</script>

<svelte:head>
  {@html `<style>${$markdown_css}</style>`}
  {@html `<style>${$highlight_css}</style>`}
</svelte:head>

<div class="w-full max-w-4xl">
  {#each $messages as msg}
    {#if msg.role === "assistant"}
      <div class="chat chat-start my-4">
        <div class="chat-bubble markdown-body">
          {#if mdi}
            {@html mdi.render(msg.content)}
          {:else}
            {msg.content}
          {/if}
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
  .markdown-body {
    @apply bg-base-100 text-base-content;
  }
  .hljs {
    @apply bg-base-100 text-base-content;
  }
</style>
