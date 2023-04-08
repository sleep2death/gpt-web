<script>
  import Header from "./lib/views/header.svelte";
  import Content from "./lib/views/content/content.svelte";
  import Footer from "./lib/views/footer/footer.svelte";
  import Drawer from "./lib/views/drawer.svelte";
  import { onMount } from "svelte";
  import { init } from "./lib/store/store";

  onMount(() => {
    init();
  });
</script>

<svelte:head>
  <meta name="theme-color" content="#65a30d" />
</svelte:head>

<main class="w-full h-screen flex flex-row flex-start">
  <div class="hidden h-full w-full lg:block z-10" style="max-width:320px;">
    <Drawer />
  </div>
  <div class="flex flex-col w-full h-full z-0">
    <Header />
    <Content />
    <Footer />
  </div>
</main>

<style>
</style>
