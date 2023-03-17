<script>
  import Header from "./lib/Header.svelte";
  import Content from "./lib/Content.svelte";
  import Footer from "./lib/Footer.svelte";
</script>

<main
  class="w-full h-screen relative from-blue-500 via-lime-500 to-yellow-500 bg-lime-300 dark:bg-black dark:from-red-500/30 dark:via-lime-500/20 dark:to-purple-500/30"
>
  <div
    class="absolute w-full h-screen bg-gradient-to-bl img-cover pointer-events-none"
  >
    <!-- <div class="flex flex-col w-full h-full z-10"> -->
    <!-- <Header /> -->
    <!-- </div> -->
  </div>
  <div
    class="hidden md:flex  h-48 bottom-0 mask absolute z-20 from-blue-500 via-lime-500 to-yellow-500 bg-lime-300 dark:bg-black dark:from-red-500/10 dark:via-lime-500/20 dark:to-purple-500/30 pointer-events-none"
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

<style>
  .img-cover {
    object-fit: cover;
    -webkit-mask-image: url(./assets/pattern-11.svg);
    mask-image: url(./assets/pattern-11.svg);
    /* background-image: url(../assets/pattern-11.svg); */
  }
</style>
