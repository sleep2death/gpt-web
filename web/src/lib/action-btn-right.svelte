<script>
  import SendIcon from "/src/assets/send-fill.svg?component";
  import MicIcon from "/src/assets/mic.svg?component";
  import MicFillIcon from "/src/assets/mic-fill.svg?component";

  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { send } from "./store.js";
  import { longpress } from "./long-press.js";

  export let mode;
</script>

<button
  class="dark:text-neutral-400 text-stone-500 {mode === 'recording'
    ? 'active:bg-blue-500'
    : ''} rounded-full p-2.5 disabled:pointer-events-none"
  on:click={send}
  use:longpress
  on:longpressed
  on:longpressup
>
  {#if mode === "normal"}
    <div in:scale={{ start: 0.6, easing: cubicOut }}>
      <MicIcon width="22" height="22" fill="currentColor" viewBox="0 0 16 16" />
    </div>
  {:else if mode === "recording"}
    <div in:scale={{ start: 0.6, easing: cubicOut }} class="text-white">
      <MicFillIcon
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </div>
  {:else}
    <div in:scale={{ start: 0.6, easing: cubicOut }} class="text-blue-500">
      <SendIcon
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </div>
  {/if}
</button>
