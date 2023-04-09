<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let sessions;
</script>

<ul class="mt-4">
  <li class="mb-4">
    <button
      class="btn btn-sm h-fit btn-outline flex flex-row justify-center relative"
      on:click={() => {
        dispatch("newchat");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        class="absolute left-4"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
        />
      </svg>
      <span class="text-xs"> New chat </span>
    </button>
  </li>
  {#each $sessions as sess (sess.id)}
    <button
      class="text-sm w-full flex flex-row py-2 px-4 rounded-2xl justify-start hover:bg-base-200"
      on:click={() => {
        dispatch("sess_selected", { id: sess.id });
      }}>{sess.label}</button
    >
  {/each}
</ul>
