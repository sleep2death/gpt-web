<script>
  import SendIcon from "/src/assets/send.svg?component";
  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { send } from "./store.js";
</script>

<button
  class="dark:text-neutral-400 text-stone-500 active:bg-stone-500
        >
        active:text-gray-50 rounded-full p-2.5 disabled:pointer-events-none"
  on:click={send}
>
  <div in:scale={{ start: 0.6, easing: cubicOut }}>
    <SendIcon width="22" height="22" fill="currentColor" viewBox="0 0 16 16" />
  </div>
</button>
