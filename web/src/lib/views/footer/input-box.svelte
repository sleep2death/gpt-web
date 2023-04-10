<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import InfoText from "./info-text.svelte";

  export let value;
  export let info;

  function onKeyDown(evt) {
    if (evt.key === "Enter" && (evt.shiftKey || evt.ctrlKey)) {
      dispatch("send");
    }
  }
</script>

<div class="chat chat-end flex-grow h-fit !gap-0 ml-4 mr-2">
  <div
    class="chat-bubble !bg-secondary-content/75 !text-base-content !w-full h-fit !px-0 !max-w-full shadow flex flex-row items-center min-h-[58px]"
  >
    {#if !$info}
      <div
        contenteditable
        class="input"
        bind:textContent={$value}
        on:keydown={onKeyDown}
      />
    {:else}
      <div class="input flex-grow">{$value}</div>
      <InfoText {info} />
    {/if}
  </div>
</div>

<style>
  .input {
    @apply outline-none w-full h-fit bg-transparent;
  }
</style>
