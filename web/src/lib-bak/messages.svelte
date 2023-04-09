<script>
  export let messages;
  import { markdown_css, highlight_css, mdi } from "./store";
  import { currentSession } from "./store/session";
</script>

<svelte:head>
  {@html `<style>${$markdown_css}</style>`}
  {@html `<style>${$highlight_css}</style>`}
</svelte:head>

{#if $currentSession}
  <div class="w-full max-w-4xl">
    {#each $currentSession.messages as msg}
      {#if msg.role === "assistant"}
        <div class="chat chat-start my-4">
          <div class="chat-bubble">
            {#if mdi}
              {@html mdi.render(msg.content)}
            {:else}
              {msg.content}
            {/if}
          </div>
        </div>
      {:else}
        <div class="chat chat-end">
          <div class="chat-bubble">
            {msg.content}
          </div>
        </div>
      {/if}
    {/each}
  </div>
{/if}

<style>
</style>
