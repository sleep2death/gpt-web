/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{svelte,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dedark: {
          "color-scheme": "dark",
          primary: "#7c3aed",
          "primary-content": "#404040",
          secondary: "#9ca3af",
          "secondary-content": "#020617",
          accent: "#1FB2A5",
          "accent-content": "#4c1d95",
          neutral: "#1f2937",
          "neutral-focus": "#111318",
          "neutral-content": "#1f2937",
          "base-100": "#1f2937",
          "base-200": "#242933",
          "base-300": "#4b5563",
          "base-content": "#e5e7eb",
          "error": "#ef4444",
        },
        delight: {
          "color-scheme": "light",
          primary: "#0284c7",
          "primary-content": "#ffffff",
          secondary: "#4b5563",
          "secondary-content": "#ffffff",
          accent: "#37cdbe",
          "accent-content": "#38bdf8",
          neutral: "#e5e7eb",
          "neutral-content": "#ffffff",
          "base-100": "#e5e7eb",
          "base-200": "#d6d3d1",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
          "error": "#ef4444",
        }
      }
    ]
  }
}

