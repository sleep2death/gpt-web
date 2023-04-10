<script>
  import {
    currentSessionId,
    selectSession,
    deleteSession,
    sessions,
  } from "../../stores/sessions";

  function select(id) {
    selectSession(id);
  }

  function del(id) {
    deleteSession(id);
  }
</script>

<ul class="w-full px-2 my-4">
  {#each $sessions as sess (sess.id)}
    <li>
      {#if $currentSessionId === sess.id}
        <div class="list-selected">
          <span>{sess.label}</span>
          <button
            class="list-action-btn"
            on:click={() => {
              del(sess.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="w-5 h-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"
              />
            </svg>
          </button>
        </div>
      {:else}
        <button
          class="list-btn hover:bg-primary/20"
          on:click={() => {
            select(sess.id);
          }}
        >
          <span>{sess.label}</span>
        </button>
      {/if}
    </li>
  {/each}
</ul>

<style>
  span {
    @apply inline-block text-ellipsis whitespace-nowrap overflow-clip;
  }
  .list-btn {
    @apply rounded-xl p-3 w-full flex flex-row;
  }
  .list-selected {
    @apply w-full text-white inline-flex;
  }
  .list-selected span {
    @apply bg-primary rounded-l-xl p-3 w-full;
  }
  .list-selected button {
    @apply bg-primary/80 py-3 rounded-r-xl px-4 text-white/90;
  }
</style>
