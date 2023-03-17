<script>
  import { controller, messages } from "./store";
  import { afterUpdate } from "svelte";
  import ChatBulb from "./chat-bulb.svelte";

  let container;

  afterUpdate(() => {
    if ($messages.length > 0) scrollToBottom(container);
  });
  const scrollToBottom = async (node) => {
    node.scroll({ top: node.scrollHeight, behavior: "smooth" });
  };
</script>

<div
  class="absolute top-0 left-0 h-screen w-full overflow-y-auto z-10"
  bind:this={container}
>
  <div class="px-4 pt-4 flex flex-row justify-center w-full">
    <div
      class="{$controller
        ? 'loading'
        : ''} flex flex-col w-full max-w-4xl pb-36"
    >
      {#each $messages as { role, content }}
        {#if role === "assistant"}
          <ChatBulb {content} />
        {:else}
          <div class="flex flex-row justify-end my-4">
            <div class="pl-8 md:pl-24 max-w-full md:max-w-3xl">
              <div
                class="dark:bg-purple-500 p-2 dark:text-neutral-300 bg-lime-100 rounded-xl "
              >
                {content}
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<style>
  :global(.loading > :last-child .markdown-body > p:last-of-type::after) {
    @apply align-middle mb-0.5;
    content: "";
    width: 10px;
    height: 22px;
    background: #ec7fff;
    display: inline-block;
    margin-left: 4px;
    animation: cursor-blink 1.5s steps(2) infinite;
  }
  @keyframes cursor-blink {
    0% {
      opacity: 0;
    }
  }
</style>
