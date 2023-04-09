<script>
  import Logo from "./logo.svelte";
  import DarkMode from "./dark-mode.svelte";
  import DrawerSwitch from "./drawer-switch.svelte";
</script>

<div class="header">
  <DrawerSwitch />
  <Logo />
  <div class="flex-grow" />
  <DarkMode />
</div>

<style>
  .header {
    @apply sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-70 backdrop-blur transition-all duration-100 bg-base-100 text-base-content shadow-sm;
  }
</style>
