<script>
  import { onMount } from "svelte";
  import { init } from "./lib/stores/store";
  import Drawer from "./lib/views/drawer/drawer.svelte";

  onMount(() => {
    init();
  });
</script>

<svelte:head />

<main>
  <Drawer />
</main>
