<script>
  import { mdi } from "../../stores/store";
  export let content;
</script>

<div class="chat chat-start !py-4">
  <div class="chat-bubble !bg-secondary-content/50 shadow">
    {#if mdi}
      <div class="markdown-body">{@html mdi.render(content)}</div>
    {:else}
      {content}
    {/if}
  </div>
</div>

<style>
  .markdown-body {
    @apply bg-transparent;
  }
</style>
