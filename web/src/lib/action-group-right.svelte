<script>
  import { Jumper } from "svelte-loading-spinners";

  import MicIcon from "/src/assets/mic.svg?component";
  import MicIconFill from "/src/assets/mic-fill.svg?component";
  import StopIcon from "/src/assets/stop-circle-fill.svg?component";
  import SendIconFill from "/src/assets/telegram.svg?component";

  import { longpress } from "./long-press.js";
  import { createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
  import GlobalMouseUp from "./global-mouseup.js";
  import { input, send } from "./store.js";

  const dispatch = createEventDispatcher();
  export let mode = "";

  let pageX;
  function onStartRecord(evt) {
    if (evt.detail) {
      pageX = evt.detail.pageX - 64;
    }
    dispatch("record_start");
  }

  function onStopLoading() {
    dispatch("loading_stop");
  }

  function onStopped() {
    if (mode === "recording") {
      dispatch("record_stop");
    }
  }
</script>

<div
  class="flex flex-col justify-end items-center px-4 py-2 md:px-2 overflow-clip"
  use:GlobalMouseUp
  on:stopped={onStopped}
>
  <!-- normal mode -->
  <button
    in:scale={{ duration: 150, start: 0.75, easing: cubicIn }}
    class="text-stone-500 active:bg-blue-300 h-10 w-10 rounded-full flex justify-center items-center {mode ===
      'pending' && $input === ''
      ? ''
      : 'hidden'}"
    use:longpress
    on:longpressed={onStartRecord}
  >
    <MicIcon width="22" height="22" fill="currentColor" viewBox="0 0 16 16" />
  </button>
  <button
    in:scale={{ duration: 150, start: 0.75, easing: cubicIn }}
    class="text-blue-500 h-10 w-10 rounded-full flex justify-center items-center {mode ===
      'pending' && $input !== ''
      ? ''
      : 'hidden'}"
    use:longpress
    on:longpressed={onStartRecord}
    on:click={send}
  >
    <SendIconFill
      width="28"
      height="28"
      fill="currentColor"
      viewBox="0 0 16 16"
    />
  </button>
  <!-- recording mode -->
  {#if mode === "recording"}
    <div
      in:scale={{ duration: 150, start: 0.75, easing: cubicIn }}
      class="text-white bg-blue-500 h-10 w-10 rounded-full md:flex hidden justify-center items-center "
    >
      <MicIconFill
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </div>
    <div
      in:scale={{ duration: 150, start: 0.75, easing: cubicIn }}
      class="text-white bg-blue-500/75 h-32 w-32 rounded-full md:hidden flex justify-center items-center absolute bottom-0"
      style="left:{pageX}px"
    >
      <Jumper color="white" duration="1.5s" size="128" />
    </div>
  {:else if mode === "loading"}
    <button
      in:scale={{ duration: 150, start: 0.75, easing: cubicIn }}
      class="text-red-500 h-10 w-10 rounded-full flex justify-center items-center"
      on:click={onStopLoading}
    >
      <StopIcon
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </button>
  {:else if mode === "context"}
    <button
      class="text-blue-500 active:bg-blue-300 h-10 w-10 rounded-full flex justify-center items-center right-0 bottom-0"
      use:longpress
      on:longpressed={onStartRecord}
    >
      <SendIconFill
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </button>
  {/if}
</div>
