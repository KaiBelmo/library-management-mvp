import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('./', import.meta.url)),
        mock: {
          indexedDb: true,
        },
      },
    },
    alias: {
      '~': resolve(__dirname, './app'),
      '~~': resolve(__dirname, './'),
      '@': resolve(__dirname, './app'),
      '@@': resolve(__dirname, './'),
    },
  },
})
