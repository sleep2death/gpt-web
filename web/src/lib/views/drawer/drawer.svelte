<script>
  import Header from "../header/header.svelte";
  import Footer from "../footer/footer.svelte";
  import Chat from "../chat/chat.svelte";
  import DrawerContent from "./drawer-content.svelte";
  import { bottom } from "../../stores/store";
  import { onMount } from "svelte";

  let container;
  let content;

  // observe chat container resize
  const resizeObserver = new ResizeObserver((entries) => {
    if (
      container.scrollTop >=
      container.scrollHeight - container.offsetHeight - 100
    ) {
      $bottom = true;
    } else {
      $bottom = false;
    }
  });

  onMount(() => {
    resizeObserver.observe(content);
  });

  function onScroll() {
    if (
      container.scrollTop >=
      container.scrollHeight - container.offsetHeight - 100
    ) {
      $bottom = true;
    } else {
      $bottom = false;
    }
  }

  function onScrollToBottom() {
    container.scrollTo({
      top: container.scrollHeight - container.offsetHeight,
      behavior: "smooth",
    });
  }
</script>

<div class="drawer drawer-mobile">
  <input id="drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content" on:scroll={onScroll} bind:this={container}>
    <!-- Page content here -->
    <div bind:this={content}>
      <Header />
      <Chat />
      <Footer on:scrollToBottom={onScrollToBottom} />
    </div>
  </div>
  <div
    class="drawer-side"
    style="scroll-behavior: smooth; scroll-padding-top: 5rem;"
  >
    <label for="drawer" class="drawer-overlay" />
    <ul class="w-80 text-base-content bg-base-200">
      <!-- Sidebar content here -->
      <DrawerContent />
    </ul>
  </div>
</div>
