import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { vi } from 'vitest'
import { ref } from 'vue'

;(global as any).__VUE_PAYLOAD_REVIVER__ = {}
;(global as any).__nuxt__ = {
  payload: {},
  ssrContext: {},
  hooks: { callHook: vi.fn(), callHookWith: vi.fn() }
}

vi.mock('@pinia/nuxt', () => ({
  default: vi.fn()
}))

const nuxtApp = {
  payload: {},
  static: { data: {} },
  runWithContext: (fn: any) => fn(),
  deferHydration: vi.fn(),
  hooks: {
    callHook: vi.fn(),
    callHookWith: vi.fn(),
    hook: vi.fn(),
  },
  _payloadRevivers: {}, 
  $router: {
    options: {
      baseURL: '/'
    }
  },
  ssrContext: {
    url: '/'
  },
  router: {
    options: {
      baseURL: '/'
    }
  }
}

mockNuxtImport('useNuxtApp', () => {
  return () => nuxtApp
})


mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      directus: {
        url: process.env.DIRECTUS_URL || 'http://localhost:8055',
      },
    },
  })
})

export const directusLogin = vi.fn()
export const directusLogout = vi.fn()
export const updateUser = vi.fn()

export const getItems = vi.fn()
export const getItemById = vi.fn()
export const createItems = vi.fn()
export const updateItem = vi.fn()
export const deleteItems = vi.fn()

mockNuxtImport('useDirectusAuth', () => {
  return () => ({
    login: directusLogin,
    logout: directusLogout,
  })
})

mockNuxtImport('useDirectusUsers', () => {
  return () => ({
    updateUser,
  })
})

mockNuxtImport('useDirectusUser', () => {
  return () => ref(null)
})

mockNuxtImport('useDirectusItems', () => {
  return () => ({
    getItems,
    getItemById,
    createItems,
    updateItem,
    deleteItems,
  })
})

/**
 * Mock useRouter
 */
mockNuxtImport('useRouter', () => {
  return () => ({
    afterEach: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })
})

mockNuxtImport('useRoute', () => {
  return () => ({
    path: '/',
    params: {},
    query: {},
    meta: {},
  })
})

/* ------------------------------------------------------------------
 * Pinia store auto-import
 * ------------------------------------------------------------------ */
mockNuxtImport('useAuthStore', () => {
  return () => ({
    hydrateAuthState: vi.fn(),
    $reset: vi.fn(),
  })
})
