import { useAuthStore } from '~/stores/auth'

/**
 * Book ownership middleware that restricts access to edit routes.
 * Only the book owner or admins can access edit routes.
 * Redirects unauthorized users to the book view page.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const { isAdminUser } = useAdmin()
  const { getById } = useBooks()
  const bookId = to.params.id as string

  if (!auth.user?.id) {
    return navigateTo('/login')
  }

  try {
    const book = await getById(bookId)

    if (!book || (book.user_created !== auth.user.id && !isAdminUser.value)) {
      return navigateTo(`/books/${bookId}`)
    }
    const sharedBook = useState(`book-${bookId}`)
    sharedBook.value = book
    
  } catch (error) {
    console.error('Middleware Permission Error:', error)
    return navigateTo('/books')
  }
})