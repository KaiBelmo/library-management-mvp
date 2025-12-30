import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useBookComments } from '@/composables/books/useBookComments'

import { getItems, createItems, deleteItems, getItemById } from '../setup'

describe('useBookComments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    getItems.mockResolvedValue([])
    createItems.mockResolvedValue(undefined)
    deleteItems.mockResolvedValue(undefined)
    getItemById.mockResolvedValue(null)
  })

  it('fetches comments and permission correctly', async () => {
    getItemById.mockResolvedValue({
      id: 'book-1',
      allow_comments: true
    })

    getItems.mockResolvedValue([
      {
        id: 'c1',
        content: 'Great book',
        book_id: 'book-1',
        date_created: '2024-01-01T00:00:00.000Z',
        user_created: { id: 'user-1' },
        author_name: 'Kai'
      }
    ])

    const {
      fetchComments,
      comments,
      canComment,
      loading
    } = useBookComments('book-1')

    await fetchComments()

    expect(loading.value).toBe(false)
    expect(canComment.value).toBe(true)

    expect(comments.value).toEqual([
      {
        id: 'c1',
        content: 'Great book',
        book_id: 'book-1',
        date_created: '2024-01-01T00:00:00.000Z',
        user_created: 'user-1',
        author_name: 'Kai'
      }
    ])

    expect(getItemById).toHaveBeenCalledOnce()
    expect(getItems).toHaveBeenCalledOnce()
  })

  it('sets canComment to false when book disables comments', async () => {
    getItemById.mockResolvedValue({
      id: 'book-1',
      allow_comments: false
    })

    getItems.mockResolvedValue([])

    const { fetchComments, canComment } = useBookComments('book-1')

    await fetchComments()

    expect(canComment.value).toBe(false)
  })

  it('handles empty comments response safely', async () => {
    getItemById.mockResolvedValue({
      id: 'book-1',
      allow_comments: true
    })

    getItems.mockResolvedValue(null)

    const { fetchComments, comments } = useBookComments('book-1')

    await fetchComments()

    expect(comments.value).toEqual([])
  })

  it('throws when adding a comment while comments are disabled', async () => {
    const { addComment, canComment } = useBookComments('book-1')

    canComment.value = false

    await expect(
      addComment('Hello world', 'Kai')
    ).rejects.toThrow('Comments are disabled for this book')

    expect(createItems).not.toHaveBeenCalled()
  })

  it('creates a comment and refetches comments', async () => {
    getItemById.mockResolvedValue({
      id: 'book-1',
      allow_comments: true
    })

    getItems.mockResolvedValue([])

    createItems.mockResolvedValue(undefined)

    const {
      addComment,
      comments
    } = useBookComments('book-1')

    await addComment('Nice read', 'Kai')

    expect(createItems).toHaveBeenCalledWith({
      collection: 'comments',
      items: [
        expect.objectContaining({
          content: 'Nice read',
          book_id: 'book-1',
          author_name: 'Kai',
          date_created: expect.any(String)
        })
      ]
    })
  })

  it('deletes a comment and updates local state', async () => {
    deleteItems.mockResolvedValue(undefined)

    const {
      deleteComment,
      comments
    } = useBookComments('book-1')

    comments.value = [
      { id: 'c1' } as any,
      { id: 'c2' } as any
    ]

    await deleteComment('c1')

    expect(deleteItems).toHaveBeenCalledWith({
      collection: 'comments',
      items: ['c1']
    })

    expect(comments.value).toEqual([
      { id: 'c2' }
    ])
  })
})
