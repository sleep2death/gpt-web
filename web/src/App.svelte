<script>
  import Content from "./lib/Content.svelte";
  import Footer from "./lib/Footer.svelte";
  import { darkmode } from "./lib/store.js";

  import { init, getLocaleFromNavigator, addMessages, _ } from "svelte-i18n";

  import en from "../locales/en.json";
  import cn from "../locales/zh-CN.json";

  import markdown_dark from "github-markdown-css/github-markdown-dark.css?inline";
  import markdown_light from "github-markdown-css/github-markdown-light.css?inline";

  import hljs_dark from "highlight.js/styles/github-dark.css?inline";
  import hljs_light from "highlight.js/styles/github.css?inline";

  addMessages("en", en);
  addMessages("zh-CN", cn);

  init({
    fallbackLocale: "en",
    loadingDelay: 1000,
    initialLocale: getLocaleFromNavigator(),
  });
</script>

<svelte:head>
  <title>{$_("title")}</title>
  {#if $darkmode}
    {@html `<style>${markdown_dark}</style>`}
    {@html `<style>${hljs_dark}</style>`}
  {:else}
    {@html `<style>${markdown_light}</style>`}
    {@html `<style>${hljs_light}</style>`}
  {/if}
  <!-- <style> -->
  <!-- {#if darkmode} -->
  <!--   {@html markdown_dark} -->
  <!--   {@html hljs} -->
  <!-- {/if} -->
  <!-- </style> -->
  <!-- <link -->
  <!--   rel="stylesheet" -->
  <!--   href={$darkmode -->
  <!--     ? "../../node_modules/highlight.js/styles/github-dark.css" -->
  <!--     : "../../node_modules/highlight.js/styles/github.css"} -->
  <!-- /> -->
  <!-- <link -->
  <!--   rel="stylesheet" -->
  <!--   href={$darkmode -->
  <!--     ? "../../node_modules/github-markdown-css/github-markdown-dark.css" -->
  <!--     : "../../node_modules/github-markdown-css/github-markdown-light.css"} -->
  <!-- /> -->
</svelte:head>

<main class={$darkmode ? "dark" : ""} style={markdown_dark}>
  <div
    class="w-full h-screen relative from-blue-500 via-lime-500 to-yellow-500 bg-lime-200 dark:bg-black dark:from-red-500/30 dark:via-lime-500/20 dark:to-purple-500/30"
  >
    <div
      class="absolute w-full h-screen bg-gradient-to-bl img-cover pointer-events-none"
    />

    <div
      class="hidden md:block h-48 bottom-0 mask absolute z-20 from-blue-500 via-lime-500 to-yellow-500 bg-lime-200 dark:bg-black dark:from-red-500/30 dark:via-lime-500/20 dark:to-purple-500/30 pointer-events-none"
      style="width:calc(100vw - 14px)"
    >
      <div
        class="absolute w-full h-screen bg-gradient-to-bl img-cover"
        style="top:calc(-100vh + 12rem)"
      />
    </div>
    <Content />
    <Footer />
  </div>
</main>
