<script>
  import Textarea from "./textarea.svelte";
  import { _ } from "svelte-i18n";
  import ActionGroupRight from "./action-group-right.svelte";

  import { startRecorder, stopRecorder, state, abort } from "./store";
  import ActionBtnLeft from "./action-btn-left.svelte";
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
      on:record_start={startRecorder}
      on:record_stop={stopRecorder}
      on:loading_stop={abort}
    />
  </div>
</div>
