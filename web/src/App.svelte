<script>
  import Input from "./lib/input.svelte";
  import LeftBtn from "./lib/left-btn.svelte";
  import RightBtn from "./lib/right-btn.svelte";
  import { input } from "./lib/store";
</script>

<main class="w-full relative">
  <!-- Action Bar -->
  <div class="w-full fixed bottom-0 flex flex-row justify-center items-center">
    <div
      class="navbar bg-base-300 md:rounded-box md:drop-shadow-md md:mb-6 max-w-3xl pb-6 md:pb-2 space-x-2"
    >
      <div class="justify-start"><LeftBtn /></div>
      <div class="justify-center w-full"><Input input={$input} /></div>
      <div class="justify-end"><RightBtn /></div>
    </div>
  </div>
</main>

<style>
</style>
