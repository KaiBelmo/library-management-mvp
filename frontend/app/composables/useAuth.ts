import { createDirectus, rest, registerUser } from '@directus/sdk'
import type { LoginCredentials, RegisterInput } from '~/types'

/**
 * Authentication composable for handling user registration, login, and logout.
 * Provides functionality to register new users, authenticate them,
 * update their profile information, and handle logout.
 * 
 * @returns {Object} Authentication methods
 * @returns {Function} registerAndLogin - Function to register and login a user
 * @returns {Function} login - Function to login existing users
 * @returns {Function} logout - Function to logout current user
 */
export const useAuth = () => {
  const config = useRuntimeConfig()
  const { updateUser } = useDirectusUsers();
  const { login: directusLogin, logout: directusLogout } = useDirectusAuth()
  const authStore = useAuthStore()
  const user = useDirectusUser()

  const baseUrl = config.public.directus.url
  if (!baseUrl) {
    throw new Error('Directus base URL is not configured')
  }

  /**
   * Directus REST client for registration operations
   * @type {ReturnType<createDirectus>}
   */
  const registerClient = createDirectus(baseUrl).with(rest())

  /**
   * Registers a new user and automatically logs them in.
   * Updates the user's profile with first and last name after successful authentication.
   * 
   * @param {RegisterInput} data - User registration data
   * @throws {Error} Throws error if registration or login fails
   */
  const registerAndLogin = async (data: RegisterInput) => {
    try {
      await registerClient.request(
        registerUser(data.email, data.password)
      )
      await login({
        email: data.email,
        password: data.password,
      })
      if (user.value && user.value.id) {
        await updateUser({
          id: user.value.id,
          user: {
            first_name: data.first_name,
            last_name: data.last_name,
          }
        });
        await authStore.hydrateAuthState()
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Logs in an existing user with email and password.
   * 
   * @param {LoginCredentials} credentials - User login credentials
   * @returns {Promise<void>} Promise that resolves when login completes
   * @throws {Error} Throws error if login fails
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      await directusLogin(credentials)
      await authStore.hydrateAuthState()
    } catch (error) {
      throw error
    }
  }

  /**
   * Logs out the current user and clears authentication state.
   * 
   * @returns {Promise<void>} Promise that resolves when logout completes
   * @throws {Error} Throws error if logout fails
   */
  const logout = async () => {
    try {
      await directusLogout()
      authStore.$reset()
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  return { registerAndLogin, login, logout }
}
