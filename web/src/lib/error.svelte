<script>
  import { error, send, removeLastEmptyResponse } from "./store";
  import { _ } from "svelte-i18n";

  let message = "";
  error.subscribe((err) => {
    if (err.includes("<404>") || err.includes("Failed to fetch")) {
      message = $_("err_notfound");
    } else if (err.includes("too many empty messages")) {
      message = $_("err_notfinished");
    } else if (err.includes("incorrect api key")) {
      message = $_("err_invalidkey");
    } else if (err.includes("AbortError")) {
      message = $_("err_aborted");
    } else if (err.includes("i/o timeout")) {
      message = $_("err_timeout");
    } else if (err === "") {
      message = "";
    } else {
      message = $_("err_unkown");
    }
  });

  function retry() {
    send({ error_continue: true });
  }

  function cancel() {
    $error = "";
    removeLastEmptyResponse();
  }
</script>

{#if message !== ""}
  <div class="flex flex-row w-full my-4">
    <div class="items-start pr-8 md:pr-24 max-w-full md:max-w-3xl">
      <div
        class="dark:bg-amber-800 dark:text-neutral-300 bg-amber-100 rounded-xl px-3 py-2"
      >
        {message}<a href="#/" on:click={retry}>{$_("retry")}</a>
        {$_("or")}
        <a href="#/" on:click={cancel}>{$_("cancel")}</a>
      </div>
    </div>
  </div>
{/if}

<style>
  a {
    @apply underline text-blue-500 mx-1;
  }
</style>
