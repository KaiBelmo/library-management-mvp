import type { Book, UpdateBookInput, CreateBookInput } from '~/schemas'
import type { DirectusResponse } from '~/types'

/**
 * Main books composable that combines all book-related functionality.
 * Provides a unified interface for book management, filtering, pagination, and user-specific operations.
 * 
 * @returns {Object} Complete books state and methods
 * @returns {Ref<Book[]>} books - Reactive array of books (with pagination)
 * @returns {Ref<string[]>} genres - Reactive array of available genres
 * @returns {Object} filters - Filter state from useBookFilters
 * @returns {Object} pagination - Pagination state for general books
 * @returns {Ref<boolean>} loading - Loading state for general operations
 * 
 * @returns {Object} userBooks - User books functionality from useUserBooks
 * @returns {Function} fetchBooks - Fetches books with current filters and pagination
 * @returns {Function} setPage - Sets current page and fetches books
 * @returns {Function} resetFilters - Resets all filters to default values
 * 
 * @returns {Function} getById - Gets a single book by ID
 * @returns {Function} create - Creates a new book
 * @returns {Function} update - Updates an existing book
 * @returns {Function} remove - Deletes a book
 */
export const useBooks = () => {
  const bookCrud = useBookCrud()
  const bookFilters = useBookFilters()
  const bookGenres = useBookGenres()
  const userBooks = useUserBooks()
  const { processBookImages } = useBookUtils()
  const books = ref<Book[]>([])
  const pagination = createPaginationState(6)

  /**
   * Fetches books from API with current filters and pagination.
   * Updates the books array and pagination state with fetched data.
   * 
   * @throws {Error} When API call fails or returns invalid data
   */
  const fetchBooks = async () => {
    const { getItems } = useDirectusItems()
    bookCrud.loading.value = true

    try {
      const { filter, sort } = bookFilters.buildFilterQuery()

      const response = (await getItems<Book>({
        collection: 'books',
        params: {
          filter,
          sort,
          page: pagination.page,
          limit: pagination.limit,
          meta: '*',
        },
      })) as DirectusResponse<Book>

      if (!response || !response.data) {
        books.value = []
        resetPagination(pagination)
        return
      }

      const currentTotal = response.meta?.filter_count ?? 0
      const paginationData = calculatePagination(currentTotal, pagination.limit)

      pagination.total = paginationData.total
      pagination.totalPages = paginationData.totalPages

      if (pagination.page > pagination.totalPages && pagination.totalPages > 0) {
        pagination.page = 1
        return fetchBooks()
      }

      books.value = processBookImages(response.data)

    } catch (error) {
      console.error('Failed to fetch books:', error)
      books.value = []
      resetPagination(pagination)
    } finally {
      bookCrud.loading.value = false
    }
  }
  /**
   * Sets the current page and fetches books for that page.
   * Updates pagination state and triggers a new fetch.
   * 
   * @param {number} page - Page number to set (1-based)
   * @throws {Error} When page is invalid or fetch fails
   */
  const setPage = async (page: number) => {
    if (page < 1 || page > pagination.totalPages) return

    pagination.page = page
    await fetchBooks()
  }

  /**
   * Resets all filters and fetches fresh data from the backend.
   * Clears filters, resets pagination, and reloads the complete book list.
   */
  const resetAll = async () => {
    bookFilters.resetFilters()
    resetPagination(pagination)
    await fetchBooks()
  }

  return {
    books,
    genres: bookGenres.genres,
    filters: bookFilters.filters,
    pagination,
    loading: bookCrud.loading,
    userBooksLoading: userBooks.loading,
    userBooks: userBooks.userBooks,
    userBooksPagination: userBooks.userBooksPagination,
    paginating: userBooks.paginating,
    expanded: userBooks.expanded,

    // Main books methods
    fetchBooks,
    setPage,
    resetFilters: bookFilters.resetFilters,
    resetAll,

    // CRUD operations (pass through)
    getById: bookCrud.getById,
    create: bookCrud.create,
    update: bookCrud.update,
    remove: bookCrud.remove,

    // Additional methods
    fetchGenres: bookGenres.fetchGenres,
    fetchUserBooks: userBooks.fetchUserBooks,
    loadUserBooks: userBooks.loadUserBooks,
    setUserBooksPage: userBooks.setUserBooksPage,
    toggleUserBooksExpanded: userBooks.toggleExpanded,
  }
}
