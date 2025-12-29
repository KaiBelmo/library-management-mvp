import type { Book, UpdateBookInput, CreateBookInput } from '~/schemas'
import type { DirectusResponse } from '~/types'
import { uploadFiles } from '@directus/sdk'

interface ApiError extends Error {
  data?: any;
  status?: number;
  statusText?: string;
}

/**
 * Book CRUD operations composable.
 * Handles basic create, read, update, delete operations for books.
 * 
 * @returns {Object} CRUD operations and state
 * @returns {Ref<boolean>} loading - Loading state for CRUD operations
 * @returns {Function} getById - Gets a single book by ID
 * @returns {Function} create - Creates a new book
 * @returns {Function} update - Updates an existing book
 * @returns {Function} remove - Deletes a book
 */
export const useBookCrud = () => {
  const { getItems, getItemById, updateItem, deleteItems, createItems } = useDirectusItems()
  const { processBookImages } = useBookUtils()
  const loading = ref(false)

  /**
   * Gets a single book by ID from the API.
   * 
   * @param {string} id - Book ID to fetch
   * @returns {Promise<Book>} Book data
   * @throws {Error} When book is not found or API call fails
   */
  const getById = async (id: string): Promise<Book> => {
    loading.value = true
    try {
      const book = await getItemById<Book>({
        collection: 'books',
        id,
        params: {
          fields: ['*']
        }
      })

      if (!book) {
        throw new Error('Book not found')
      }

      const processedBooks = processBookImages([book])
      return processedBooks[0]!
    } catch (error) {
      console.error('Failed to get book:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Creates a new book in the system.
   * 
   * @param {CreateBookInput} data - Book data to create
   * @returns {Promise<Book>} Created book data
   * @throws {Error} When creation fails or validation errors occur
   */
  const create = async (data: CreateBookInput): Promise<Book> => {
    loading.value = true
    try {
      // Use the data directly as it already includes allow_comments with default
      const bookData = { ...data }
      
      const createdBooks = await createItems<Book>({
        collection: 'books',
        items: [bookData],
      })

      if (!createdBooks || !createdBooks[0]) {
        throw new Error('Failed to create book - no books returned')
      }

      const response: DirectusResponse<Book> = {
        data: createdBooks
      }

      if (!response.data || !response.data[0]) {
        throw new Error('Failed to create book - no data returned')
      }

      const processedBooks = processBookImages([response.data[0]])
      return processedBooks[0]!
    } catch (error) {
      const err = error as ApiError
      console.error('Failed to create book:', err.message || 'Unknown error')
      console.error('Error details:', {
        message: err.message || 'No error message',
        data: err.data,
        status: err.status,
        statusText: err.statusText
      })
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Updates an existing book.
   * 
   * @param {string} id - Book ID to update
   * @param {UpdateBookInput} data - Book data to update
   * @returns {Promise<Book>} Updated book data
   * @throws {Error} When update fails or book not found
   */
  const update = async (id: string, data: UpdateBookInput): Promise<Book> => {
    loading.value = true
    try {
      // Use the data directly since it already includes allow_comments
      const updateData = { ...data }
      
      const updatedBook = await updateItem<Book>({
        collection: 'books',
        id,
        item: updateData,
      })

      if (!updatedBook) {
        throw new Error('Failed to update book')
      }

      const processedBooks = processBookImages([updatedBook])
      return processedBooks[0]!
    } catch (error) {
      console.error('Failed to update book:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Deletes a book from the system.
   * 
   * @param {string} id - Book ID to delete
   * @returns {Promise<void>} Promise that resolves when deletion completes
   * @throws {Error} When deletion fails
   */
  const remove = async (id: string): Promise<void> => {
    loading.value = true
    try {
      await deleteItems({
        collection: 'books',
        items: [id],
      })
    } catch (error) {
      console.error('Failed to delete book:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    getById,
    create,
    update,
    remove,
  }
}
