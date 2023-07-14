/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./error.vue",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // https://tailwindcss.com/docs/content-configuration#safelisting-classes
  // Not all colors are made available: https://ui.nuxtlabs.com/getting-started/theming#colors
  // Needed this to get success, warning and error colours to work.
  safelist: [
    {
      pattern: /bg-red-.+/,
    },
    {
      pattern: /bg-green-.+/,
    },
    {
      pattern: /bg-yellow-.+/,
    },
    {
      pattern: /text-red-.+/,
    },
    {
      pattern: /text-green-.+/,
    },
    {
      pattern: /text-yellow-.+/,
    },
  ],
  darkMode: "class",
};
