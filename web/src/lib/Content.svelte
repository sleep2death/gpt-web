<script>
  import { controller, messages } from "./store";
  import { afterUpdate } from "svelte";
  import ChatBulb from "./chat-bulb.svelte";
  import Error from "./error.svelte";
  import ChatBulbUser from "./chat-bulb-user.svelte";
  import Welcome from "./welcome.svelte";

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
      <Welcome />
      {#each $messages as { role, content }}
        {#if role === "assistant"}
          <ChatBulb {content} />
        {:else}
          <ChatBulbUser {content} />
        {/if}
      {/each}
      <Error />
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
