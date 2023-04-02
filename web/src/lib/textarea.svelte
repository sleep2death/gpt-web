<script>
  import RecordIcon from "/src/assets/record2.svg?component";
  import {
    addCommand,
    input,
    send,
    suggestionIndex,
    suggestions,
  } from "./store.js";
  import { _ } from "svelte-i18n";
  import { fly } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
  import { fuseResult } from "./fuse.js";

  let textarea;
  export let mode;

  input.subscribe((value) => {
    if (textarea && textarea.parentNode) {
      textarea.parentNode.dataset.replicatedValue = value;
    }
  });

  function onKeyDown(evt) {
    if (evt.ctrlKey && evt.key === "Enter") {
      send();
    } else if ($suggestions) {
      if (evt.key === "ArrowUp") {
        evt.preventDefault();
        $suggestionIndex = $suggestionIndex > 0 ? $suggestionIndex - 1 : 0;
      } else if (evt.key === "ArrowDown") {
        evt.preventDefault();
        $suggestionIndex =
          $suggestionIndex < $fuseResult.length - 1
            ? $suggestionIndex + 1
            : $fuseResult.length - 1;
      } else if (evt.key === "Enter") {
        evt.preventDefault();

        // set command
        const current = $fuseResult[$suggestionIndex].item;
        addCommand(current);

        // move cursor to the end
        textarea.focus();
        document.execCommand("selectAll", false, null);
        document.getSelection().collapseToEnd();
      }
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

{#if mode === "recording"}
  <div
    in:fly={{ y: 20, duration: 150, easing: cubicIn }}
    class="flex flex-row md:justify-center justify-start items-center bg-stone-300 p-2 rounded-2xl font-semibold text-red-500"
  >
    <RecordIcon
      width="22"
      height="22"
      fill="currentColor"
      viewBox="0 0 16 16"
    />
    {$_("recording")}
  </div>
{:else}
  <div
    class="px-4 h-full flex flex-row justify-start items-center dark:bg-black bg-white rounded-2xl relative dark:text-white"
  >
    <div
      bind:this={textarea}
      contenteditable="true"
      class="w-full outline-none block"
      bind:innerHTML={$input}
      on:keydown={onKeyDown}
      on:paste={onPaste}
    />
    <!-- <div class="grow-wrap w-full"> -->
    <!--   <textarea -->
    <!--     name="text" -->
    <!--     id="autocomplete" -->
    <!--     bind:value={$input} -->
    <!--     bind:this={textarea} -->
    <!--     class="break-words break-all outline-none bg-transparent" -->
    <!--     rows={1} -->
    <!--     placeholder={$_("input_placeholder")} -->
    <!--     on:keydown={onKeyDown} -->
    <!--   /> -->
    <!-- </div> -->
  </div>
{/if}

<style>
  .grow-wrap {
    /* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
    display: grid;
  }

  .grow-wrap::after {
    /* Note the weird space! Needed to preventy jumpy behavior */
    content: attr(data-replicated-value) " ";

    /* This is how textarea text behaves */
    white-space: pre-wrap;

    /* Hidden from view, clicks, and screen readers */
    visibility: hidden;

    @apply break-words break-all;
  }
  .grow-wrap > textarea {
    /* You could leave this, but after a user resizes, then it ruins the auto sizing */
    resize: none;

    /* Firefox shows scrollbar on growth, you can hide like this. */
    overflow: hidden;
  }
  .grow-wrap > textarea,
  .grow-wrap::after {
    /* Identical styling required!! */
    /* border: 1px solid black; */
    /* padding: 0.5rem; */
    font: inherit;

    /* Place on top of each other */
    grid-area: 1 / 1 / 2 / 2;
  }
</style>
