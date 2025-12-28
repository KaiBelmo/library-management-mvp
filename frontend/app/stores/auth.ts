import { defineStore } from 'pinia'
import { z } from 'zod'

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
})
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  role: z.union([
    z.string(),          // role id only
    RoleSchema,          // hydrated role object
  ]).nullable(),
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
    isAdmin: (state) => {
      const role = state.user?.role;
      if (!role) return false;
      if (typeof role === 'object' && 'name' in role) {
        return role.name === 'Administrator';
      }
      return false;
    },
    fullName: (state) => {
      if (!state.user) return null
      const firstName = state.user.first_name || ''
      const lastName = state.user.last_name || ''
      return firstName || lastName ? `${firstName} ${lastName}`.trim() : state.user.email
    },

  },

  actions: {
    setUser(user: User) {
      if (typeof user.role === 'string') {
        console.warn('REVERSION DETECTED: Role is a string!');
        console.trace();
      }

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
      const directus = useDirectus();
      try {
        const fetchedUser: any = await directus('/users/me', {
          params: {
            fields: ['*', 'role.id', 'role.name'],
          },
        })
        if (fetchedUser && fetchedUser.data) {
          const validatedUser = UserSchema.parse(fetchedUser.data)
          this.setUser(validatedUser)
        } else {
          this.setGuest()
        }
      } catch (error) {
        this.setGuest()
      }
    },
  },
})
