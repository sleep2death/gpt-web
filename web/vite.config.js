import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import svg from '@poppanator/sveltekit-svg'

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'


// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  envDir: "../",
  envPrefix: "GPTW_",
  plugins: [svelte({
    configFile: false,
    preprocess: [vitePreprocess()]
  }), svg({}),],
  build: {
    emptyOutDir: true
  }
})
