<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let value;

  function onKeyDown(evt) {
    if (evt.key === "Enter" && (evt.ctrlKey || evt.metaKey)) {
      dispatch("send");
    }
  }

  function onPaste(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData("text/plain");

    // insert text manually
    document.execCommand("insertHTML", false, text);
  }
</script>

<div class="w-full p-2.5 rounded bg-base-100">
  <div
    contenteditable="true"
    class="text-base-content w-full outline-base-200 outline-offset-8"
    bind:innerHTML={$value}
    on:keydown={onKeyDown}
    on:paste={onPaste}
  />
</div>
