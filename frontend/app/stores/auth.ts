import { defineStore } from 'pinia'
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  role: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    status: 'loading' as 'loading' | 'authenticated' | 'guest',
  }),

  getters: {
    isAuthenticated: (state) => state.status === 'authenticated',
    isGuest: (state) => state.status === 'guest',
    isLoading: (state) => state.status === 'loading',
    fullName: (state) => {
      if (!state.user) return null
      const firstName = state.user.first_name || ''
      const lastName = state.user.last_name || ''
      return firstName || lastName ? `${firstName} ${lastName}`.trim() : state.user.email
    },
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.status = 'authenticated'
    },

    clearAuth() {
      this.user = null
      this.status = 'guest'
    },

    setGuest() {
      this.user = null
      this.status = 'guest'
    },

    setLoading() {
      this.status = 'loading'
    },

    async hydrateAuthState() {
      this.setLoading()
      const { fetchUser } = useDirectusAuth()
      try {
        const user = await fetchUser()
        if (user) {
          const validatedUser = UserSchema.parse(user)
          this.user = validatedUser
          this.status = 'authenticated'
        } else {
          this.setGuest()
        }
      } catch (error) {
        this.setGuest()
      }
    },

    async logout() {
      const { logout } = useDirectusAuth()
      await logout()
      this.user = null
      this.status = 'guest'
      navigateTo('/login')
    },
  },
})
