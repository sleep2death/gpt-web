<script>
  import { markdown_css, highlight_css } from "../../stores/store";
  import { currentSession } from "../../stores/sessions";
  import LBubble from "./l-bubble.svelte";
</script>

<svelte:head>
  {@html `<style>${$markdown_css}</style>`}
  {@html `<style>${$highlight_css}</style>`}
</svelte:head>

<div class="chat-container">
  <div class="messages">
    {#if $currentSession}
      {#each $currentSession.messages as msg}
        {#if msg.role === "assistant"}
          <LBubble content={msg.content} />
        {:else}
          <div class="chat chat-end !py-4">
            <div
              class="chat-bubble !bg-accent-content !text-base-content shadow"
            >
              {msg.content}
            </div>
          </div>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .chat-container {
    @apply w-full flex flex-row justify-center mb-28 mt-8;
  }

  .messages {
    @apply w-full flex flex-col max-w-3xl pr-16;
  }

  .markdown-body {
    @apply bg-transparent;
  }
</style>
