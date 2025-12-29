// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  imports: {
    dirs: [
      "composables",
      "composables/*/index.{ts,js,mjs,mts}",
      "composables/**",
    ],
  },
  directus: {
    url: process.env.DIRECTUS_URL || "http://localhost:8055",
    autoFetch: true,
  },

  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL,
      corsEnabled: process.env.CORS_ENABLED,
      corsOrigin: process.env.CORS_ORIGIN,
    },
  },

  modules: [
    "@nuxt/eslint",
    "nuxt-directus",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/ui",
  ],
});
