// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@vueuse/nuxt", "@nuxthq/ui", "@nuxtjs/color-mode", "nuxt-icon"],
  css: ["~/assets/css/main.css"],
  ssr: false,
});
