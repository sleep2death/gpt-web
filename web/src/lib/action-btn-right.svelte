<script>
  import PaperPlaneSolidIcon from "/src/assets/paper-plane-solid.svg";
  import PaperPlaneIcon from "/src/assets/paper-plane.svg";
  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { input, send } from "./store.js";
</script>

<button
  class="dark:text-neutral-400 text-stone-500 active:bg-stone-500
        >
        active:text-gray-50 rounded-full p-2.5 disabled:pointer-events-none"
  on:click={send}
  disabled={$input === ""}
>
  {#if $input === ""}
    <div in:scale={{ start: 0.6, easing: cubicOut }}>
      <PaperPlaneIcon width="100%" fill="currentColor" class="w-6 h-6" />
    </div>
  {:else}
    <div in:scale={{ start: 0.6, easing: cubicOut }} class="text-blue-500">
      <PaperPlaneSolidIcon width="100%" fill="currentColor" class="w-6 h-6" />
    </div>
  {/if}
</button>
