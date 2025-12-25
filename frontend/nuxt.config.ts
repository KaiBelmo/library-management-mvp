// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  directus: {
    url: process.env.DIRECTUS_URL,
    autoFetch: true,
  },

  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL,
      corsEnabled: process.env.CORS_ENABLED,
      corsOrigin: process.env.CORS_ORIGIN
    }
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-directus', '@pinia/nuxt'],
})