<script>
  import {
    sessions,
    startNewSession,
    currentSessionId,
    selectSession,
  } from "../store/session";
  import { darkmode } from "../store/store";
</script>

<div class="flex flex-col w-full h-full">
  <div class="w-full flex flex-row">darkmode: {$darkmode}</div>
  <!-- sessions -->
  <button
    class="rounded-xl border px-2 py-1 mx-2 hover:bg-stone-200 active:bg-stone-300 flex flex-row justify-center items-center space-x-1"
    on:click={() => {
      startNewSession();
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z"
      />
      <path
        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"
      />
    </svg><i />
    <span>新对话</span>
  </button>
  <ul class="flex flex-col w-full p-2">
    {#each $sessions as sess (sess.id)}
      <li>
        {#if $currentSessionId === sess.id}
          <div
            class="flex flex-row space-x-2 w-full justify-start items-center"
          >
            <div
              class="p-4 bg-sky-500 text-white rounded-xl flex-1 max-w-full overflow-hidden text-ellipsis"
            >
              {sess.label}
            </div>
            <button
              class="rounded-full text-white bg-red-500 w-12 h-12 p-0 flex flex-shrink-0 items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi bi-trash3"
                viewBox="0 0 16 16"
              >
                <path
                  d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
                />
              </svg>
            </button>
          </div>
        {:else}
          <button
            on:click={selectSession(sess.id)}
            class="w-full flex flex-row hover:bg-stone-200 p-4 rounded-xl {$currentSessionId ===
            sess.id
              ? 'bg-sky-500 text-white hover:bg-sky-500'
              : 'text-black'} "
            ><div
              class="whitespace-nowrap overflow-hidden text-ellipsis inline-block"
            >
              {sess.label}
            </div>
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</div>
