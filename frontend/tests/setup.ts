import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { vi } from 'vitest'

// Mock any global Nuxt composables or modules here
mockNuxtImport('useNuxtApp', () => {
  return () => ({
    $fetch: vi.fn(),
    $config: { public: {} },
  })
})

// Mock any other global objects or functions as needed
