<script>
  import SendIcon from "/src/assets/send-fill.svg?component";
  import MicIcon from "/src/assets/mic.svg?component";
  import MicFillIcon from "/src/assets/mic-fill.svg?component";

  import { scale } from "svelte/transition";
  import { longpress } from "./long-press.js";

  export let mode;
</script>

<div class={mode === "recording" ? "w-32 ml-4" : ""}>
  <button
    class="dark:text-neutral-400 text-stone-500 {mode === 'normal'
      ? ''
      : 'hidden'} p-2"
    use:longpress
    on:longpressed
    on:longpressup
  >
    <MicIcon width="22" height="22" fill="currentColor" viewBox="0 0 16 16" />
  </button>

  {#if mode === "recording"}
    <div
      in:scale={{ start: 0.6, duration: 200 }}
      class="text-white bg-blue-500 rounded-full p-2 w-full h-full flex justify-center items-center"
    >
      <MicFillIcon
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </div>
  {/if}

  {#if mode === "input"}
    <button
      class="text-blue-500 {mode === 'input' ? '' : 'hidden'} p-2"
      on:click
      in:scale={{ start: 0.5, duration: 200 }}
    >
      <SendIcon
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </button>
  {/if}
</div>
