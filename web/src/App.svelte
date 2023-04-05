<script>
  import Input from "./lib/input.svelte";
  import LeftBtn from "./lib/left-btn.svelte";
  import Messages from "./lib/messages.svelte";
  import RightBtn from "./lib/right-btn.svelte";
  import { input, send, state, messages } from "./lib/store";
  import Toast from "./lib/toast.svelte";
</script>

<main class="w-full h-screen relative">
  <!-- background color and patterns -->
  <div class="w-full h-screen fixed bg-base-200 ">
    <div class="fixed w-full h-screen pointer-events-none" />
  </div>

  <div
    class="hidden md:block h-48 bottom-0 mask fixed z-20 bg-base-200 pointer-events-none"
    style="width:calc(100vw - 14px)"
  >
    <div class="fixed bottom-0 w-full h-screen" />
  </div>

  <!-- Messages -->
  <div class="fixed top-0 h-screen w-full flex flex-col overflow-y-auto z-10">
    <div class="w-full flex flex-row justify-center mb-36">
      <Messages {messages} />
    </div>
  </div>

  <!-- Action Bar -->
  <div class="fixed bottom-0 z-30 w-full flex flex-col">
    <Toast />
    <!-- Input Bar -->
    <div class="w-full flex flex-row justify-center items-center mask z-30">
      <div
        class="navbar bg-base-300 md:rounded-box md:drop-shadow-md md:mb-6 max-w-3xl pb-6 md:pb-2 space-x-2"
      >
        <div class="justify-start"><LeftBtn /></div>
        <div class="justify-center w-full">
          <Input value={input} on:send={send} />
        </div>
        <div class="justify-end">
          <RightBtn on:send={send} disabled={$state === "loading"} />
        </div>
      </div>
    </div>
  </div>
</main>

<style>
</style>
