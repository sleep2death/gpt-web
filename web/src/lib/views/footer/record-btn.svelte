<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let timeout = 0;

  function onMouseDown() {
    timeout = setTimeout(() => {
      dispatch("start_record");
      clearTimeout(timeout);
      timeout = 0;
    }, 500);
    window.addEventListener("mouseup", onMouseUp);
  }

  function onMouseUp() {
    window.removeEventListener("mouseup", onMouseUp);
    if (timeout) {
      clearTimeout(timeout);
      timeout = 0;
    } else {
      dispatch("stop_record");
    }
  }
</script>

<button
  class="btn btn-circle shadow btn-primary h-[54px] w-[54px] ml-0.5"
  on:click
>
  <svg
    class="btn-icon"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
    <path
      d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
    />
  </svg>
</button>

<style>
  .btn-icon {
    @apply w-6 h-6 text-white;
  }
</style>
