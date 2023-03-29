<script>
  import RecordIcon from "/src/assets/record2.svg?component";
  import { input, send } from "./store.js";
  import { _ } from "svelte-i18n";
  import { fly } from "svelte/transition";
  import { cubicIn } from "svelte/easing";

  let textarea;
  export let mode;

  input.subscribe((value) => {
    if (textarea && textarea.parentNode) {
      textarea.parentNode.dataset.replicatedValue = value;
    }
  });
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
    class="px-4 h-full flex justify-start items-center dark:bg-black bg-white rounded-2xl relative dark:text-white"
  >
    <div class="grow-wrap w-full">
      <textarea
        name="text"
        id="autoComplete"
        bind:value={$input}
        bind:this={textarea}
        class="break-words break-all outline-none bg-transparent"
        rows={1}
        placeholder={$_("input_placeholder")}
        on:keydown={(evt) => {
          if (evt.ctrlKey && evt.key === "Enter") {
            send();
          }
        }}
      />
    </div>
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
