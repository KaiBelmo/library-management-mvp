import type { User, UseUserReturn } from '~/types'

export const useUser = (): UseUserReturn => {
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const { updateUser } = useDirectusUsers()
  
  const isAuthenticated = computed(() => authStore.status === 'authenticated')
  
  const updateProfile = async (userId: string, profileData: any) => {
    try {
      await updateUser({
        id: userId,
        user: profileData,
      })
      if (authStore.user?.id === userId) {
        Object.assign(authStore.user, profileData)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }
  
  return {
    isAuthenticated,
    updateProfile,
  }
}
