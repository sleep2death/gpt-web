<script>
  export let input;
</script>

<div class="w-full p-2.5 rounded bg-base-100">
  <div
    contenteditable="true"
    class="text-base-content w-full outline-base-200 outline-offset-8"
    bind:innerHTML={input}
  />
</div>
