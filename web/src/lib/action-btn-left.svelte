<script>
  import ToiletPaperIcon from "/src/assets/toilet-paper.svg";
  import HandSolidIcon from "/src/assets/hand-paper-solid.svg";
  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { controller, messages, error } from "./store.js";
</script>

<button
  class="dark:text-neutral-400 text-stone-500 active:bg-stone-500
        >
        active:text-gray-50 rounded-full p-2.5"
  on:click={() => {
    if ($controller) {
      $controller.abort();
    } else {
      $messages = [];
      $error = "";
    }
  }}
>
  {#if !$controller}
    <div in:scale={{ start: 0.6, easing: cubicOut }}>
      <ToiletPaperIcon width="100%" fill="currentColor" class="w-6 h-6" />
    </div>
  {:else}
    <div in:scale={{ start: 0.6, easing: cubicOut }} class="text-red-500">
      <HandSolidIcon width="100%" fill="currentColor" class="w-6 h-6" />
    </div>
  {/if}
</button>
