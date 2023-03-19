<script>
  import Content from "./lib/Content.svelte";
  import Footer from "./lib/Footer.svelte";
  import Modal from "./lib/modal.svelte";
</script>

<main
  class="w-full h-screen relative from-blue-500 via-lime-500 to-yellow-500 bg-lime-300 dark:bg-black dark:from-red-500/30 dark:via-lime-500/20 dark:to-purple-500/30"
>
  <Modal />
  <div
    class="absolute w-full h-screen bg-gradient-to-bl img-cover pointer-events-none"
  />
  <div
    class="hidden md:block h-48 bottom-0 mask absolute z-20 from-blue-500 via-lime-500 to-yellow-500 bg-lime-300 dark:bg-black dark:from-red-500/10 dark:via-lime-500/20 dark:to-purple-500/30 pointer-events-none"
    style="width:calc(100vw - 14px)"
  >
    <div
      class="absolute w-full h-screen bg-gradient-to-bl img-cover"
      style="top:calc(-100vh + 12rem)"
    />
  </div>
  <Content />
  <Footer />
</main>
