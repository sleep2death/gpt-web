<script>
  import { input, send, controller } from "./store.js";
  import ActionBtnLeft from "./action-btn-left.svelte";
  import ActionBtnRight from "./action-btn-right.svelte";
</script>

<div
  class="absolute flex flex-row z-20 justify-center md:pb-8 md:px-16 w-full bottom-0"
>
  <div
    class="flex flex-row w-full pb-8 px-2 pt-2 md:p-4 bg-stone-200 border-t dark:bg-stone-700 dark:border-stone-600 md:rounded-2xl max-w-4xl"
  >
    <div class="py-1 flex flex-col justify-end">
      <ActionBtnLeft />
    </div>
    <div class="flex-grow flex flex-col justify-center">
      <!-- HACK: https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/ -->
      <div class="grow-wrap">
        <textarea
          class="rounded-2xl outline-none resize-none max-w-full dark:bg-black placeholder:font-thin dont-break-out"
          rows="1"
          oninput="this.parentNode.dataset.replicatedValue = this.value"
          bind:value={$input}
          placeholder="<Ctrl> + <Enter> 发送。"
          on:keydown={(evt) => {
            if (evt.code === "Enter" && evt.ctrlKey) {
              send();
            }
          }}
        />
      </div>
    </div>
    <div class="py-1 flex flex-col justify-end">
      <ActionBtnRight />
    </div>
  </div>
</div>

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
    /* border: 1px solid white; */
    /* padding: 0.5rem; */
    @apply px-4 py-1 break-words;
    font: inherit;

    /* Place on top of each other */
    grid-area: 1 / 1 / 2 / 2;
  }

  .dont-break-out {
    /* These are technically the same, but use both */
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    /* This is the dangerous one in WebKit, as it breaks things wherever */
    word-break: break-all;
    /* Instead use this non-standard one: */
    word-break: break-word;

    /* Adds a hyphen where the word breaks, if supported (No Blink) */
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
  }
</style>
