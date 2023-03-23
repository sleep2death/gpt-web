<script>
  import { mode, send, input, darkmode } from "./store.js";
  import Toggle from "./toggle.svelte";
  import { _ } from "svelte-i18n";

  const labels = [
    { id: "creative", label: $_("creative") },
    { id: "balanced", label: $_("balanced") },
    { id: "accurate", label: $_("accurate") },
  ];

  const examples = [
    {
      title: $_("answering"),
      prompts: [$_("example_prompt_1")],
    },
    {
      title: $_("coding"),
      prompts: [$_("example_prompt_2")],
    },
    {
      title: $_("translation"),
      prompts: [$_("example_prompt_3")],
    },
  ];

  function sendExample(evt) {
    $input = evt.currentTarget.innerHTML;
    send();
  }
</script>

<div class="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
  <div class="md:col-start-2 flex justify-center my-4 relative">
    <div
      class="dark:bg-stone-800 dark:text-neutral-300 bg-white px-4 py-2 rounded-2xl text-xl text-neutral-800 h-fit"
    >
      <h1 class="inline-block">{$_("welcome")}</h1>
      <span class="text-xs inline-block align-top rounded px-0.5">beta</span>
    </div>
  </div>
  <div class="md:col-start-3 md:justify-end my-6 flex flex-row justify-end">
    <div
      class="flex flex-row bg-lime-100 dark:bg-stone-800 dark:text-stone-300 rounded-2xl items-center p-2"
    >
      <div class="text-xs items-center">{$_("dark_mode")}</div>
      <Toggle bind:value={$darkmode} />
    </div>
  </div>
  {#each examples as example, i}
    <div
      class="md:col-start-{i +
        1} bg-lime-100 dark:bg-stone-800 dark:text-stone-300 rounded-2xl flex flex-col"
    >
      <div class="text-center p-1 pb-0.5">{example.title}</div>
      {#each example.prompts as prompt}
        <button
          class="border-t border-lime-300 dark:border-stone-600 text-center text-blue-500 p-1 pb-0.5"
          on:click={sendExample}>{prompt}</button
        >
      {/each}
    </div>
  {/each}
</div>
<div class="flex flex-row justify-center mb-4">
  <div
    class="flex flex-col justify-center rounded-2xl bg-lime-100 dark:bg-stone-800 dark:text-stone-300 w-fit"
  >
    <h2 class="text-center p-2 rounded-t-2xl">{$_("conversation_style")}</h2>
    <div
      class="relative border-t border-lime-300 dark:border-stone-600 flex flex-row justify-center p-2 rounded-b-2xl space-x-2"
    >
      {#each labels as label}
        <button
          class="px-4 py-2 relative flex"
          on:click={() => ($mode = label.id)}
        >
          <div class="z-20 inline {$mode === label.id ? 'text-white' : ''}">
            {label.label}
          </div>
          {#if $mode === label.id}
            <div
              class="absolute bg-blue-500 w-full h-full top-0 left-0 rounded-xl z-10"
            />
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>
