<script>
  import MicIcon from "/src/assets/info-circle.svg?component";

  import { scale } from "svelte/transition";
  import { cubicIn } from "svelte/easing";
  import { input, suggestions, suggestionIndex } from "./store";
</script>

<div class="flex flex-col justify-end items-center p-2 relative z-10">
  <button
    in:scale={{ duration: 150, start: 0.75, easing: cubicIn }}
    class="text-stone-500 active:bg-blue-300 h-10 w-10 rounded-xl flex justify-center items-center"
  >
    <MicIcon width="22" height="22" fill="currentColor" viewBox="0 0 16 16" />
  </button>
  {#if $suggestions}
    <ul
      class="absolute bottom-16 left-0 p-1.5 rounded-2xl bg-stone-50 dark:bg-stone-200 drop-shadow-md"
    >
      {#each Object.entries($suggestions) as [key, s]}
        <li
          class="w-72 flex flex-col items-start cursor-default p-2 border-b border-stone-300 last:border-none w-full"
        >
          <div class="text-xs pb-1">
            {key}
          </div>
          <ul class="w-full">
            {#each s as f (f.index)}
              <li class="relative">
                <button
                  class="flex flex-row flex-start items-center p-1 w-full rounded {f.index ===
                  $suggestionIndex
                    ? 'bg-stone-200'
                    : ''}"
                  on:click={() => {
                    $input = f.value;
                    // send();
                    // console.log($current.options);
                  }}
                >
                  <img
                    src="/public/{f.icon}"
                    alt={f.label}
                    class="mr-1 text-stone-500"
                  />
                  <div class="flex-grow flex flex-start">{f.label}</div>
                  {#if f.index === $suggestionIndex}
                    <img
                      src="/public/arrow-return-left.svg"
                      alt={f.label}
                      class="text-stone-500"
                    />
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  button:hover > img {
    display: flex;
  }
</style>
