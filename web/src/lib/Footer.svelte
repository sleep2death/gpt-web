<script>
  import ActionBtnLeft from "./action-btn-left.svelte";
  import ActionBtnRight from "./action-btn-right.svelte";
  import Textarea from "./textarea.svelte";
</script>

<div
  class="absolute flex flex-row z-20 justify-center md:pb-8 md:px-16 bottom-0 w-full"
>
  <div
    class="flex flex-row justify-center w-full  md:max-w-4xl pb-8 px-2 pt-2 md:p-4 bg-stone-200 border-t dark:bg-stone-700 dark:border-stone-600 md:rounded-2xl"
  >
    <div class="py-1 flex flex-col justify-end">
      <ActionBtnLeft />
    </div>
    <div class="flex flex-col justify-center w-full">
      <Textarea />
    </div>
    <div class="py-1 flex flex-col justify-end">
      <ActionBtnRight />
    </div>
  </div>
</div>

<style>
</style>
