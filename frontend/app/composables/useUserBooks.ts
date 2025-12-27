import type { Book } from '~/schemas'
import type { DirectusResponse } from '~/types'
import { calculatePagination, getPageItems, createPaginationState, resetPagination } from './useBookPagination'

/**
 * User books composable for managing user-specific book collections.
 * Handles fetching, paginating, and managing books created by a specific user.
 * 
 * @returns {Object} User books state and methods
 * @returns {Ref<Book[]>} userBooks - Reactive array of user's books (current page)
 * @returns {Object} userBooksPagination - Pagination state for user books
 * @returns {Ref<boolean>} loading - Loading state for user books operations
 * @returns {Ref<boolean>} paginating - Loading state for pagination changes
 * @returns {Ref<boolean>} expanded - Expansion state for user books section
 * @returns {Function} fetchUserBooks - Fetches all books created by specific user
 * @returns {Function} loadUserBooks - Loads user books with pagination
 * @returns {Function} setUserBooksPage - Sets user books page with pagination
 * @returns {Function} toggleExpanded - Toggles user books expansion state
 * @returns {Function} resetUserBooks - Resets all user books state
 */
export const useUserBooks = () => {
  const { getItems } = useDirectusItems()
  const { processBookImages } = useBookUtils()

  const userBooks = ref<Book[]>([])
  const loading = ref(false)
  const paginating = ref(false)
  const expanded = ref(false)
  const userBooksPagination = createPaginationState(3)

  /**
   * Fetches all books created by a specific user from the API.
   * Returns all books without pagination for internal processing.
   * 
   * @param {string} userId - User ID to fetch books for
   * @returns {Promise<Book[]>} Array of user's books
   * @throws {Error} When API call fails or user ID is invalid
   */
  const fetchUserBooks = async (userId: string): Promise<Book[]> => {
    if (!userId) return []

    loading.value = true
    try {
      console.log('Fetching books for user:', userId)
      
      const userData = await getItems<Book>({
        collection: 'books',
        params: {
          filter: {
            user_created: { _eq: userId },
          },
          sort: ['-date_created'],
        },
      })
      
      const response: DirectusResponse<Book> = {
        data: userData
      }

      if (!response?.data) {
        console.log('No user books response data found')
        return []
      }

      const processedBooks = processBookImages(response.data)
      console.log('Processed user books:', processedBooks)
      return processedBooks
    } catch (error) {
      console.error('Error fetching user books:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Loads user books with pagination for display.
   * Fetches all user books and applies pagination for the current view.
   * Updates both the books array and pagination state.
   * 
   * @param {string} userId - User ID to load books for
   * @throws {Error} When API call fails or pagination setup fails
   */
  const loadUserBooks = async (userId: string) => {
    if (!userId) return

    loading.value = true
    try {
      const allBooks = await fetchUserBooks(userId)
      const paginationData = calculatePagination(allBooks.length, userBooksPagination.limit)
      
      Object.assign(userBooksPagination, paginationData)
      userBooks.value = getPageItems(allBooks, userBooksPagination.page, userBooksPagination.limit)
    } catch (error) {
      console.error('Error loading user books:', error)
      userBooks.value = []
      resetPagination(userBooksPagination)
    } finally {
      loading.value = false
    }
  }

  /**
   * Sets user books page and updates the displayed books for that page.
   * More efficient than loading all books again as it uses cached data.
   * 
   * @param {number} page - Page number to set (1-based)
   * @param {string} userId - User ID to fetch books for
   * @throws {Error} When API call fails or page is invalid
   */
  const setUserBooksPage = async (page: number, userId: string) => {
    if (!userId || page < 1) return

    paginating.value = true
    try {
      const allBooks = await fetchUserBooks(userId)
      
      userBooksPagination.page = page
      userBooks.value = getPageItems(allBooks, page, userBooksPagination.limit)
    } catch (error) {
      console.error('Error setting user books page:', error)
      userBooksPagination.page = 1
      if (userId) {
        await loadUserBooks(userId)
      }
    } finally {
      paginating.value = false
    }
  }

  /**
   * Toggles the expansion state of the user books section.
   * Useful for UI components that can collapse/expand user book lists.
   */
  const toggleExpanded = () => {
    expanded.value = !expanded.value
  }

  /**
   * Resets all user books state to initial values.
   * Clears books array, resets pagination, and collapses section.
   */
  const resetUserBooks = () => {
    userBooks.value = []
    resetPagination(userBooksPagination)
    expanded.value = false
  }

  return {
    userBooks,
    userBooksPagination,
    loading,
    paginating,
    expanded,
    fetchUserBooks,
    loadUserBooks,
    setUserBooksPage,
    toggleExpanded,
    resetUserBooks,
  }
}
