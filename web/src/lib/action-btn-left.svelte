<script>
  import MicIcon from "/src/assets/info-circle.svg?component";
  import { scale } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
</script>

<div class="flex flex-col justify-end items-center p-2">
  <button
    in:scale={{ duration: 150, start: 0.75, easing: cubicIn }}
    class="text-stone-500 active:bg-blue-300 h-10 w-10 rounded-full flex justify-center items-center"
  >
    <MicIcon width="22" height="22" fill="currentColor" viewBox="0 0 16 16" />
  </button>
</div>
