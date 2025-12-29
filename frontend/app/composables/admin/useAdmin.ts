import type { AdminStats, UseAdminReturn } from '~/types'

/**
 * Admin composable for managing admin-specific functionality.
 * Provides access to admin statistics, user directory, and admin-only operations.
 * 
 * @returns {Object} Admin state and methods
 * @returns {Ref<any[]>} allUsers - Reactive array of all users in the system
 * @returns {AdminStats} adminStats - Reactive admin statistics (total books, total users)
 * @returns {ComputedRef<boolean>} isAdminUser - Computed property indicating if current user is admin
 * @returns {Function} loadRegistryData - Loads admin statistics and user directory data
 * 
 */
export const useAdmin = (): UseAdminReturn => {
  const authStore = useAuthStore()
  
  const { getUsers } = useDirectusUsers()
  const { pagination, fetchBooks } = useBooks()
  
  const allUsers = ref<any[]>([])
  
  const adminStats = reactive<AdminStats>({
    totalBooks: 0,
    totalUsers: 0,
  })
  
  const isAdminUser = computed(() => authStore.isAdmin)
  
  /**
   * Loads registry data for admin dashboard.
   * Fetches total books count and all users in the system.
   * Only executes if current user has admin privileges.
   * 
   * @throws {Error} When API calls fail
   */
  const loadRegistryData = async () => {
    if (!isAdminUser.value) return
    
    try {
      await fetchBooks()
      adminStats.totalBooks = pagination.total
      
      const users = await getUsers({
        params: { fields: ['id', 'first_name', 'last_name', 'email'] },
      })
      
      allUsers.value = Array.isArray(users) ? users : []
      adminStats.totalUsers = allUsers.value.length
    } catch (error) {
      console.error('Failed to load registry data:', error)
      Object.assign(adminStats, { totalBooks: 0, totalUsers: 0 })
      allUsers.value = []
    }
  }
  
  return {
    allUsers,
    adminStats,    
    isAdminUser,
    loadRegistryData,
  }
}
