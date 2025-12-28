import { ref } from 'vue'
import type { Book } from '~/schemas'
import type { Comment } from '~/schemas/comment.schema'

/**
 * Book comments composable for managing comments on a specific book.
 * Provides functionality to fetch, add, and delete comments with permission checks.
 * * @param {string} bookId - ID of the book to manage comments for
 */
export const useBookComments = (bookId: string) => {
  const { getItems, createItems, deleteItems, getItemById } = useDirectusItems()

  /** Reactive comments array */
  const comments = ref<Comment[]>([])
  
  /** Loading state for initial fetch and operations */
  const loading = ref(false)

  /** * Permission state: 
   * true = comments allowed
   * false = comments disabled
   * null = haven't checked yet
   */
  const canComment = ref<boolean | null>(null)

  /**
   * Fetches comments for the specified book and checks if commenting is allowed.
   * Runs both requests in parallel for better performance.
   */
  const fetchComments = async () => {
    loading.value = true
    try {
      // Perform both API calls simultaneously
      const [bookResponse, commentsResponse] = await Promise.all([
        getItemById<Book>({
          collection: 'books',
          id: bookId,
          params: {
            fields: ['id', 'allow_comments']
          }
        }),
        getItems<Comment[]>({
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
      ])

      // 1. Update permission state
      canComment.value = bookResponse?.allow_comments ?? false

      // 2. Update comments list
      if (!commentsResponse) {
        comments.value = []
        return
      }

      comments.value = commentsResponse.map((item: any) => ({
        id: item.id,
        content: item.content,
        book_id: item.book_id,
        date_created: item.date_created,
        user_created: item.user_created?.id || item.user_created || '',
        author_name: item.author_name || 'Anonymous'
      }))
    } catch (err) {
      console.error('Error fetching comments or book permissions:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Adds a new comment to the book if allowed.
   * * @param {string} content - Comment content
   * @param {string} author_name - Author name
   * @throws {Error} When comments are disabled for the book
   */
  const addComment = async (content: string, author_name: string) => {
    // Frontend-only guard: prevent API call if we already know it's disabled
    if (canComment.value === false) {
      throw new Error('Comments are disabled for this book')
    }

    try {
      const commentData = {
        content,
        book_id: bookId,
        author_name,
        date_created: new Date().toISOString(),
      }

      await createItems({
        collection: 'comments',
        items: [commentData]
      })

      // Refresh data to show the new comment and re-verify status
      await fetchComments()
    } catch (err: any) {
      console.error("Failed to add comment:", err.message)
      throw err
    }
  }

  /**
   * Deletes a comment by ID.
   * @param {string} id - Comment ID to delete
   */
  const deleteComment = async (id: string) => {
    try {
      await deleteItems({ 
        collection: 'comments', 
        items: [id] 
      })
      comments.value = comments.value.filter((c: Comment) => c.id !== id)
    } catch (err) {
      console.error("Failed to delete comment:", err)
    }
  }

  return { 
    comments, 
    loading, 
    canComment, 
    fetchComments, 
    addComment, 
    deleteComment 
  }
}