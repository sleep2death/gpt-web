<script>
  import { mode, send, input } from "./store.js";

  const labels = [
    { id: "creative", label: "创意" },
    { id: "balanced", label: "平衡" },
    { id: "accurate", label: "精确" },
  ];

  function sendExample(evt) {
    $input = evt.currentTarget.innerHTML;
    send();
  }
</script>

<div class="flex flex-row justify-center my-4">
  <div
    class="dark:bg-stone-800 dark:text-neutral-300 bg-white px-4 py-2 rounded-2xl text-xl text-neutral-800"
  >
    <h1 class="inline-block">欢迎使用GPT-GIN</h1>
    <span class="text-xs inline-block align-top rounded px-0.5">beta</span>
  </div>
</div>
<div class="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
  <div class="bg-lime-100 rounded-2xl flex flex-col space-y-2 py-4">
    <div class="text-center">🧐 提出复杂问题</div>
    <button class="text-center link" on:click={sendExample}
      >爱因斯坦的广义相对论讲的是什么？</button
    >
  </div>
  <div class="bg-lime-100 rounded-2xl flex flex-col space-y-2 py-4">
    <div class="text-center">🤖 编写代码</div>
    <button class="text-center link" on:click={sendExample}
      >如何用rust语言处理http请求？</button
    >
  </div>
  <div class="bg-lime-100 rounded-2xl flex flex-col space-y-2 py-4">
    <div class="text-center">📖 翻译润色外语</div>
    <button class="text-center link" on:click={sendExample}
      >请翻译：Le passé c’est le passé</button
    >
  </div>
  <div />
  <div class="flex flex-col justify-center rounded-2xl bg-lime-100">
    <h2 class="text-center p-2 rounded-t-2xl">对话风格</h2>
    <div
      class="relative border-t border-lime-300 dark:bg-stone-800 flex flex-row justify-center p-2 rounded-b-2xl space-x-2"
    >
      {#each labels as label}
        <button
          class="px-4 py-2 relative flex"
          on:click={() => ($mode = label.id)}
        >
          <div class="z-20 {$mode === label.id ? 'text-white' : ''}">
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

<style>
  .link {
    @apply text-blue-500;
  }
</style>
