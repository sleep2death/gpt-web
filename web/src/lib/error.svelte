<script>
  import { error, send } from "./store";
</script>

{#if $error !== ""}
  <div class="flex flex-row w-full my-4">
    <div class="items-start pr-8 md:pr-24 max-w-full md:max-w-3xl">
      <div
        class="dark:bg-amber-800 dark:text-neutral-300 bg-amber-100 rounded-xl px-3 py-2"
      >
        {#if $error.includes("too many empty messages")}
          因字数限制未完成，可以点击<button
            class="underline text-blue-500 mx-1"
            on:click={() => {
              send({ error_continue: true });
            }}>继续</button
          >，或忽略。
        {:else}
          {$error}
        {/if}
      </div>
    </div>
  </div>
{/if}
