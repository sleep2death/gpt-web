<script>
  import { derived } from "svelte/store";
  import { onMount } from "svelte";
  import { themeChange } from "theme-change";

  import {
    input,
    send,
    state,
    session,
    abort,
    startRecord,
    stopRecord,
    init,
    drawer,
  } from "./lib/store";

  import Input from "./lib/input.svelte";
  import LeftBtn from "./lib/left-btn.svelte";
  import Messages from "./lib/messages.svelte";
  import RightBtn from "./lib/right-btn.svelte";
  import ToastLoading from "./lib/toast-loading.svelte";
  import Drawer from "./lib/drawer/drawer.svelte";

  const toast_msg = derived(state, ($state) => {
    if ($state === "loading") {
      return "正在加载";
    } else if ($state === "recording") {
      return "正在录音";
    } else if ($state === "transcoding") {
      return "正在转码";
    }
    return "";
  });

  onMount(async () => {
    await init();
    themeChange(false);
  });
</script>

<main class="w-full h-screen relative">
  <!-- background color and patterns -->
  <Drawer>
    <div class="w-full h-screen fixed bg-base-100 z-0">
      <div class="fixed w-full h-screen pointer-events-none" />
    </div>

    <div
      class="hidden md:block h-48 bottom-0 mask fixed bg-base-100 pointer-events-none z-20 "
      style="width:calc(100vw - 14px)"
    >
      <div class="fixed bottom-0 w-full h-screen bg-base-100" />
    </div>

    <!-- Messages -->
    <div class="fixed top-0 h-screen w-full flex flex-col overflow-y-auto z-10">
      <div class="w-full flex flex-row justify-center mb-36">
        <Messages messages={$session.messages} />
      </div>
    </div>

    <!-- Action Bar -->
    <div class="fixed bottom-0 z-30 w-full flex flex-col">
      <!-- Loading Bar -->
      {#if $state === "loading" || $state === "transcoding" || $state === "recording"}
        <div class="z-0 mb-2">
          <ToastLoading on:click={abort} message={$toast_msg} />
        </div>
      {/if}
      <!-- Bar -->
      <div class="w-full flex flex-row justify-center items-center z-10">
        <div
          class="navbar bg-base-300 md:rounded-box md:mb-6 max-w-3xl pb-6 md:pb-2 space-x-2"
        >
          <!-- Left Button -->
          <div class="justify-start">
            <LeftBtn on:click={() => ($drawer = true)} />
          </div>
          <!-- Input Bar -->
          <div class="justify-center w-full">
            <Input value={input} on:send={send} />
          </div>
          <!-- Right Button -->
          <div class="justify-end">
            <RightBtn
              usingMic={$input === "" || $state === "recording"}
              {state}
              on:send={send}
              on:start_record={startRecord}
              on:stop_record={stopRecord}
            />
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</main>
