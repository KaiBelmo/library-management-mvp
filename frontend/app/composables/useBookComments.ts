import type { Comment } from '~/schemas/comment.schema'

/**
 * Book comments composable for managing comments on a specific book.
 * Provides functionality to fetch, add, and delete comments.
 * 
 * @param {string} bookId - ID of the book to manage comments for
 * @returns {Object} Comments state and methods
 * @returns {Ref<Comment[]>} comments - Reactive comments array
 * @returns {Ref<boolean>} loading - Loading state for operations
 * @returns {Function} fetchComments - Fetches comments for the book
 * @returns {Function} addComment - Adds a new comment
 * @returns {Function} deleteComment - Deletes a comment
 */
export const useBookComments = (bookId: string) => {
  const { getItems, createItems, deleteItems } = useDirectusItems()
  /** Reactive comments array */
  const comments = ref<Comment[]>([])
  /** Loading state */
  const loading = ref(false)

  /**
   * Fetches comments for the specified book.
   * Sorts by date_created in descending order.
   */
  const fetchComments = async () => {
    loading.value = true
    try {
      const response = await getItems<Comment[]>({
        collection: 'comments',
        params: {
          filter: { book_id: { _eq: bookId } },
          sort: ['-date_created'],
          fields: [
            'id',
            'user_created.id',
            'date_created',
            'author_name',
            'content',
            'book_id'
          ]
        }
      })
      
      if(!response) {
        comments.value = []
        return
      }
      comments.value = response.map((item: any) => ({
        id: item.id,
        content: item.content,
        book_id: item.book_id,
        date_created: item.date_created,
        user_created: item.user_created?.id || item.user_created || '',
        author_name: item.author_name || 'Anonymous'
      }))
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Adds a new comment to the book.
   * @param {string} content - Comment content
   * @param {string} author_name - Author name
   */
  const addComment = async (content: string, author_name: string) => {
    try {
      await createItems({
        collection: 'comments',
        items: [
          {
            content,
            book_id: bookId,
            author_name: author_name
          }
        ]
      })
      await fetchComments()
    } catch (err: any) {
      console.error("Failed to add annotation:", err.message)
    }
  }

  /**
   * Deletes a comment by ID.
   * @param {string} id - Comment ID to delete
   */
  const deleteComment = async (id: string) => {
    await deleteItems({ collection: 'comments', items: [id] })
    comments.value = comments.value.filter((c: Comment) => c.id !== id)
  }

  return { comments, loading, fetchComments, addComment, deleteComment }
}