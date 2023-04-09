<script>
  import { fly } from "svelte/transition";
  export let message = "";
</script>

<div
  transition:fly={{ y: 75, duration: 400 }}
  class="w-full flex flex-row justify-center"
>
  <button
    class="flex flex-row items-center justify-centermax-w-md w-fit border border-base-300 rounded-2xl p-2 bg-base-100"
    on:click
  >
    <div class="mr-1 text-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-stop-circle"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
        />
        <path
          d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z"
        />
      </svg>
    </div>
    <span>{message}</span>
  </button>
</div>
