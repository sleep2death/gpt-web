<script>
  import Textarea from "./textarea.svelte";
  import { _ } from "svelte-i18n";
  import ActionGroupRight from "./action-group-right.svelte";

  import { input, state } from "./store";
  import ActionBtnLeft from "./action-group-left.svelte";
  import IatRecorder from "./recorder";

  let rc;
  async function onRecordStart() {
    const resp = await fetch(import.meta.env.GPTW_XF_API_URL, {
      method: "POST",
    });

    const api = await resp.json();
    rc = new IatRecorder(api.url);
    rc.addEventListener("textchange", (evt) => {
      $input = evt.detail;
    });

    rc.addEventListener("close", () => {
      $state = "pending";
    });

    rc.start();
    $state = "recording";
  }

  function onRecordStop() {
    rc.stop();
    $state = "loading";
  }
</script>

<div class="absolute z-20 md:pb-8 md:px-16 bottom-0 w-full flex justify-center">
  <div
    class="flex flex-row justify-center w-full md:max-w-4xl pb-8 md:pb-0 bg-stone-200 border-t dark:bg-stone-700 dark:border-stone-600 md:rounded-2xl"
  >
    <ActionBtnLeft />
    <div class="flex-grow py-2">
      <Textarea mode={$state} />
    </div>
    <ActionGroupRight
      mode={$state}
      on:record_start={onRecordStart}
      on:record_stop={onRecordStop}
    />
  </div>
</div>
