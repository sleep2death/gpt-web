<script>
  import { derived } from "svelte/store";
  import {
    state,
    startRecord,
    stopRecord,
    input,
    abortTranscoding,
    bottom,
  } from "../../stores/store";

  import InputBox from "./input-box.svelte";
  import RecordBtn from "./record-btn.svelte";
  import SendBtn from "./send-btn.svelte";
  import LoadingBtn from "./loading-btn.svelte";
  import { addMessages } from "../../stores/sessions";
  import { abort, chat } from "../../stores/chat";
  import ScrollBtn from "./scroll-btn.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const info = derived(state, ($state) => {
    if ($state === "loading") {
      return "正在生成，点击红色按钮取消";
    } else if ($state === "recording") {
      return "正在录制，点击红色按钮停止";
    } else if ($state === "transcoding") {
      return "正在转码，点击红色按钮取消";
    }
  });

  async function send() {
    addMessages([
      { role: "user", content: $input },
      { role: "assistant", content: "" },
    ]);
    $input = "";
    await chat();
  }
</script>

<div class="footer lg:left-40 left-0">
  <div class="w-full max-w-[768px] mb-4 relative">
    <div class="w-full flex flex-row justify-center items-center">
      <InputBox value={input} {info} on:send={send} />
      {#if $state === "idle" && $input === ""}
        <RecordBtn on:click={startRecord} />
      {:else if $state === "idle"}
        <SendBtn on:click={send} />
      {:else if $state === "loading"}
        <LoadingBtn on:click={abort} />
      {:else if $state === "recording"}
        <LoadingBtn on:click={() => stopRecord()} />
      {:else if $state === "transcoding"}
        <LoadingBtn on:click={abortTranscoding} />
      {/if}
    </div>
    {#if !$bottom}
      <div class="absolute bottom-[5rem] right-1">
        <ScrollBtn
          on:click={() => {
            dispatch("scrollToBottom");
          }}
        />
      </div>
    {/if}
  </div>
  <div />
</div>

<style>
  .footer {
    @apply w-full fixed bottom-0 flex flex-row justify-center items-center bg-base-100 bg-opacity-70 backdrop-blur transition-all;
  }
</style>
