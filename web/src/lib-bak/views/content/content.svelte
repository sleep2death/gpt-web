<script>
  import { markdown_css, highlight_css, mdi } from "../../store/store.js";
  import { currentSession } from "../../store/session";
  console.log(mdi);
</script>

<svelte:head>
  {@html `<style>${$markdown_css}</style>`}
  {@html `<style>${$highlight_css}</style>`}
</svelte:head>

<div class="w-full flex-grow overflow-y-auto overflow-x-hidden bg-lime-100">
  {#if $currentSession}
    <div class="w-full flex flex-row justify-center space-y-8 my-12">
      <div
        class="flex flex-col space-y-8 w-full py-2 px-chat"
        style="max-width:728px"
      >
        {#each $currentSession.messages as msg}
          {#if msg.role === "assistant"}
            <div class="bubble start">
              <div
                class="rounded-2xl chat-bubble-left bg-white px-4 py-2 relative"
              >
                {#if mdi}
                  <div class="markdown-body">
                    {@html mdi.render(msg.content)}
                  </div>
                {:else}
                  {msg.content}
                {/if}
              </div>
            </div>
          {:else}
            <div class="bubble end">
              <div
                class="rounded-2xl chat-bubble-right bg-lime-300 px-4 py-2 relative"
              >
                {msg.content}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .markdown-body {
  }

  .bubble {
    @apply flex flex-row w-full;
    min-height: 2.75rem;
    min-width: 2.75rem;
  }

  .bubble.start {
    @apply justify-start pr-8;
  }

  .bubble.end {
    @apply justify-end pl-8;
  }

  .px-chat {
    padding-left: 16px;
    padding-right: 56px;
  }
</style>
