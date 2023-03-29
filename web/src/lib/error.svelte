<script>
  import { error, send, removeLastEmptyResponse } from "./store";
  import { _ } from "svelte-i18n";

  let message = "";
  let canRetry = true;
  error.subscribe((err) => {
    if (err.includes("<404>") || err.includes("Failed to fetch")) {
      message = $_("err_notfound");
      canRetry = true;
    } else if (err.includes("too many empty messages")) {
      message = $_("err_notfinished");
      canRetry = true;
    } else if (err.includes("incorrect api key")) {
      message = $_("err_invalidkey");
      canRetry = true;
    } else if (err.includes("record uploading failed:")) {
      message = $_("err_record_uploading");
      canRetry = false;
    } else if (err.includes("AbortError")) {
      message = $_("err_aborted");
      canRetry = true;
    } else if (err.includes("i/o timeout")) {
      message = $_("err_timeout");
      canRetry = true;
    } else if (err.includes("proxyconnect")) {
      message = $_("err_proxy");
      canRetry = true;
    } else if (err === "") {
      message = "";
      canRetry = true;
    } else {
      message = err;
      canRetry = false;
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
        {message}
        {#if canRetry}
          <button on:click={retry}>{$_("retry")}</button>
          {$_("or")}
        {/if}
        <button on:click={cancel}>{$_("cancel")}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  button {
    @apply underline text-blue-500 mx-1;
  }
</style>
