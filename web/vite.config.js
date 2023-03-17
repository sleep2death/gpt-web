import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteSVG } from "rollup-plugin-svelte-svg";
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [svelte(), svelteSVG({
    // optional SVGO options
    // pass empty object to enable defaults
    svgo: {},
    // vite-specific
    // https://vitejs.dev/guide/api-plugin.html#plugin-ordering
    // enforce: 'pre' | 'post'
    enforce: "pre",
  }), splitVendorChunkPlugin()],
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('highlight.js')) {
          return 'hljs';
        }
      },
    },
  }
})
