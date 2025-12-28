export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  const user = useDirectusUser()
  if (user.value) {
    authStore.hydrateAuthState()
  } else {
    authStore.setGuest()
  }
})