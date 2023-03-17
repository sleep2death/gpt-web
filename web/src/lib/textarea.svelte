<script>
  import { input, send } from "./store.js";

  let textarea;

  input.subscribe((value) => {
    if (textarea && textarea.parentNode) {
      textarea.parentNode.dataset.replicatedValue = value;
    }
  });
</script>

<div
  class="px-4 py-2 dark:bg-black bg-white rounded-2xl relative dark:text-white"
>
  <div class="grow-wrap">
    <textarea
      name="text"
      id="text"
      bind:value={$input}
      bind:this={textarea}
      class="break-words break-all outline-none bg-transparent"
      rows={1}
      placeholder="请问我任何问题。"
      on:keydown={(evt) => {
        if (evt.ctrlKey && evt.key === "Enter") {
          send();
        }
      }}
    />
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
