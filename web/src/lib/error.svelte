<script>
  import { error, send, removeLastEmptyResponse } from "./store";
  import { _ } from "svelte-i18n";

  function retry() {
    send({ error_continue: true });
  }

  function cancel() {
    $error = "";
    removeLastEmptyResponse();
  }
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
            on:click={retry}>继续</button
          >，或忽略。
        {:else if $error.includes("<404>")}
          {$_("err_notfound")}<a href="#/" on:click={retry}>{$_("retry")}</a>
          {$_("or")}
          <a href="#/" on:click={cancel}>{$_("cancel")}</a>
        {:else if $error.includes("AbortError")}
          {$_("err_user_aborted")}<a href="#/" on:click={retry}>{$_("retry")}</a
          >
          {$_("or")}
          <a href="#/" on:click={cancel}>{$_("cancel")}</a>
        {:else}
          <div>
            意外错误：{$error}<button
              class="underline text-blue-500 mx-1"
              on:click={() => {
                send({ retry: true });
              }}>重试</button
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  a {
    @apply underline text-blue-500 mx-1;
  }
</style>
