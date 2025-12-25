export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  const user = useDirectusUser()

  if (user.value) {
    authStore.user = UserSchema.parse(user.value)
    authStore.status = 'authenticated'
  } else {
    await authStore.hydrateAuthState()
  }
})