<script>
  import TrashIcon from "../assets/trash3.svg?component";
  import StopIcon from "../assets/stop-circle-fill.svg?component";

  import { scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { controller, messages, error, abort } from "./store.js";

  function release(node) {
    const handleRelease = (evt) => {
      if (!node.contains(evt.target)) {
        node.dispatchEvent(new CustomEvent("release"));
      }
    };
    document.addEventListener("release", handleRelease, true);

    return {
      destroy() {
        document.removeEventListener("click", handleRelease, true);
      },
    };
  }
</script>

<button
  class="dark:text-neutral-400 text-stone-500 active:bg-stone-500
        >
        active:text-gray-50 rounded-full p-2.5"
  on:click={() => {
    if ($controller) {
      abort();
    } else {
      $messages = [];
      $error = "";
    }
  }}
  use:release
>
  {#if !$controller}
    <div in:scale={{ start: 0.6, easing: cubicOut }}>
      <TrashIcon
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </div>
  {:else}
    <div in:scale={{ start: 0.6, easing: cubicOut }} class="text-red-500">
      <StopIcon
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      />
    </div>
  {/if}
</button>
