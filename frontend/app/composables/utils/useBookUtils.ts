import type { Book } from '~/schemas'

/**
 * Shared book utilities composable.
 * Provides common utility functions used across book-related composables.
 * 
 * @returns {Object} Book utility functions
 * @returns {Function} processBookImages - Processes image URLs for books
 */
export const useBookUtils = () => {
  const config = useRuntimeConfig()

  /**
   * Processes book image URLs to include the Directus asset URL.
   * Converts relative image IDs to full URLs.
   * 
   * @param {Book[]} books - Array of books to process
   * @returns {Book[]} Books with processed image URLs
   */
  const processBookImages = (books: Book[]) => {
    return books.map((book) => {
      const imageUrl = book.cover_photo
        ? `${config.public.directusUrl}/assets/${book.cover_photo}`
        : undefined
      
      return {
        ...book,
        image: imageUrl,
        cover_photo: book.cover_photo
      }
    })
  }

  return {
    processBookImages,
  }
}
