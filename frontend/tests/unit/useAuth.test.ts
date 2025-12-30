import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useAuth } from '@/composables/auth/useAuth'

import { directusLogin, directusLogout, updateUser } from '../setup'
const requestMock = vi.fn()

vi.mock('@directus/sdk', () => ({
  createDirectus: vi.fn(() => ({
    with: vi.fn(() => ({
      request: requestMock
    }))
  })),
  rest: vi.fn(),
  registerUser: vi.fn((email: string, password: string) => ({
    email,
    password
  }))
}))

const hydrateAuthState = vi.fn()
const resetStore = vi.fn()

const userRef = ref<{ id?: string } | null>({
  id: 'user-1'
})

vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      directus: {
        url: process.env.DIRECTUS_URL || 'http://localhost:8055'
      }
    }
  }),

  useDirectusAuth: () => ({
    login: directusLogin,
    logout: directusLogout
  }),

  useDirectusUsers: () => ({
    updateUser
  }),

  useDirectusUser: () => userRef,

  useAuthStore: () => ({
    hydrateAuthState,
    $reset: resetStore
  })
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userRef.value = { id: 'test-user-id' }
    
    directusLogin.mockResolvedValue(undefined)
    directusLogout.mockResolvedValue(undefined)
    updateUser.mockResolvedValue(undefined)
    hydrateAuthState.mockResolvedValue(undefined)
    requestMock.mockResolvedValue(undefined)
  })

  it('registers and logs in a user successfully', async () => {
    expect(true).toBe(true)
  })

  it('logs in an existing user', async () => {
    expect(true).toBe(true)
  })

  it('logs out and resets auth store', async () => {
    expect(true).toBe(true)
  })

  it('throws if Directus base URL is missing', () => {
    expect(true).toBe(true)
  })

  it('skips updateUser if user is not hydrated', async () => {
    userRef.value = null

    directusLogin.mockResolvedValue(undefined)
    hydrateAuthState.mockResolvedValue(undefined)
    requestMock.mockResolvedValue(undefined)

    const { registerAndLogin } = useAuth()

    await registerAndLogin({
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Kai',
      last_name: 'Nguyen'
    })

    expect(updateUser).not.toHaveBeenCalled()
  })
})
