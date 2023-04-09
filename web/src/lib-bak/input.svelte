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
    var text = (e.originalEvent || e).clipboardData
      .getData("text/plain")
      .trim();

    // insert text manually
    $value = text;
    // document.execCommand("insertHTML", false, text);
  }
</script>

<div class="w-full p-2.5 rounded-full bg-base-100 relative">
  <div
    contenteditable="true"
    class="text-base-content w-full outline-base-200 outline-offset-8 rounded-full px-2"
    bind:innerHTML={$value}
    on:keydown={onKeyDown}
    on:paste={onPaste}
  />
  <!--<div
    class="absolute right-0 top-0 p-1 h-full flex items-center justify-center"
  >
    <button class="rounded-full bg-base-300 p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        class="bi bi-mic-fill"
        viewBox="0 0 16 16"
      >
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
        <path
          d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
        />
      </svg>
    </button>
  </div>-->
</div>
