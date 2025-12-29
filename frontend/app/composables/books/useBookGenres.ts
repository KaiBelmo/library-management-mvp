import type { DirectusResponse } from '~/types'

/**
 * Book genres composable for managing and fetching book genres.
 * Handles genre extraction from books and genre list management.
 * 
 * @returns {Object} Genres state and methods
 * @returns {Ref<string[]>} genres - Reactive array of available genres
 * @returns {Ref<boolean>} loading - Loading state for genre operations
 * @returns {Function} fetchGenres - Fetches all available genres from books
 * @returns {Function} extractGenresFromBooks - Extracts unique genres from book array
 */
export const useBookGenres = () => {
  const { getItems } = useDirectusItems()
  const genres = ref<string[]>([])
  const loading = ref(false)

  /**
   * Extracts unique genres from an array of books.
   * Filters out empty or null genre values and removes duplicates.
   * 
   * @param {any[]} books - Array of books with genre property
   * @returns {string[]} Array of unique genre names
   */
  const extractGenresFromBooks = (books: any[]): string[] => {
    const allGenres = books
      .map(book => book.genre)
      .filter(genre => genre && genre.trim() !== '')
    
    return [...new Set(allGenres)].sort()
  }

  /**
   * Fetches all available genres from existing books in the system.
   * Queries the books collection and extracts unique genre values.
   * Updates the reactive genres array with the results.
   */
  const fetchGenres = async () => {
    loading.value = true
    try {
      const genreData = await getItems({
        collection: 'books',
        params: {
          fields: ['genre'],
          limit: -1, // Get all books
        },
      })

      if (!genreData) {
        genres.value = []
        return
      }

      genres.value = extractGenresFromBooks(genreData)
    } catch (error) {
      console.error('Failed to fetch genres:', error)
      genres.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    genres,
    loading,
    fetchGenres,
    extractGenresFromBooks,
  }
}
