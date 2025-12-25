import { createDirectus, rest, registerUser } from '@directus/sdk'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const { updateUser } = useDirectusUsers();
  const { login: directusLogin } = useDirectusAuth()
  const authStore = useAuthStore()
  const user = useDirectusUser()

  const baseUrl = config.public.directus.url
  if (!baseUrl) {
    throw new Error('Directus base URL is not configured')
  }

  const registerClient = createDirectus(baseUrl).with(rest())

  const registerAndLogin = async (data: RegisterInput) => {
    await registerClient.request(
      registerUser(data.email, data.password)
    )
    await directusLogin({
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
  }

  return { registerAndLogin }
}
