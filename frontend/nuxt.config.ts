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
  },

  runtimeConfig: {
    public: {
      directusUrl: process.env.DIRECTUS_URL
    }
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-directus'],
})