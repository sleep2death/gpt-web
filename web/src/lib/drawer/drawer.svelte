<script>
  import Logo from "./logo.svelte";
  import { lightmode, drawer } from "../store.js";
  import Sessions from "./sessions.svelte";
  import { sessions, newChat, selectSession } from "../store/session";
</script>

<div class="drawer">
  <input
    id="drawer"
    type="checkbox"
    class="drawer-toggle"
    bind:checked={$drawer}
  />
  <div class="drawer-content">
    <!-- Page content here -->
    <slot />
  </div>
  <div class="drawer-side">
    <label for="drawer" class="drawer-overlay" />
    <div class="menu p-4 w-full md:w-72 bg-base-100">
      <!-- Sidebar content here -->
      <!-- Logo -->
      <Logo {lightmode} />
      <Sessions
        on:newchat={newChat}
        on:sess_selected={(evt) => selectSession(evt.detail.id)}
        {sessions}
      />
    </div>
  </div>
</div>
