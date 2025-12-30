import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,

    exclude: [
      '**/node_modules/**',
      '**/tests/e2e/**',
      '**/*.e2e.*',
    ],

    setupFiles: ['./tests/setup.ts'],

    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('./', import.meta.url)),

        overrides: {
          app: {
            baseURL: '/'
          },
          runtimeConfig: {
            public: {}
          }
        },

        mock: {
          indexedDb: true,
        },
      },
    },

      alias: {
        '~': resolve(__dirname, './'),
        '~~': resolve(__dirname, './'),
        '@': resolve(__dirname, './app'),
        '@@': resolve(__dirname, './'),
      },
  },
})