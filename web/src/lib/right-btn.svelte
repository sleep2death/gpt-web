<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import { sineIn } from "svelte/easing";
  const dispatch = createEventDispatcher();

  export let usingMic = true;
  export let state = null;

  let timeout = 0;

  function onMouseDown(evt) {
    timeout = setTimeout(() => {
      dispatch("start_record");
      clearTimeout(timeout);
      timeout = 0;
    }, 500);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseUp(evt) {
    window.removeEventListener("mouseup", onMouseUp);
    if (timeout) {
      clearTimeout(timeout);
      timeout = 0;
    } else {
      dispatch("stop_record");
    }
  }
</script>

{#if $state === "idle"}
  {#if !usingMic}
    <button
      in:fade={{ duration: 150, easing: sineIn }}
      class="btn btn-ghost btn-circle"
      on:click={() => {
        dispatch("send");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
        />
      </svg>
    </button>
  {:else}
    <button
      in:fade={{ duration: 150, easing: sineIn }}
      class="btn btn-ghost btn-circle"
      on:mousedown={onMouseDown}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
        />
        <path
          d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"
        />
      </svg>
    </button>
  {/if}
{:else}
  <button in:fade={{ duration: 150, easing: sineIn }} class="btn" disabled>
    <span class="loader" />
  </button>
{/if}

<style>
  .loader {
    @apply bg-primary;
    width: 20px;
    height: 20px;
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg) scale(0.2);
      border-radius: 10%;
    }
    50% {
      transform: rotate(180deg) scale(1.5);
      border-radius: 50%;
    }
    100% {
      transform: rotate(360deg) scale(0.2);
      border-radius: 10%;
    }
  }
</style>
