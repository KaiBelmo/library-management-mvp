import { z } from 'zod'

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  genre: z.string().min(1, 'Genre is required').max(50, 'Genre too long'),
  publication_date: z.string().datetime(),
  cover_photo: z.string().uuid(),
  user_created: z.string().uuid(),
  date_created: z.string().datetime(),
})

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  genre: z.string().min(1, 'Genre is required').max(50, 'Genre too long'),
  publication_date: z.string().min(1, 'Publication date is required'),
  cover_photo: z.string().uuid(),
})

export const UpdateBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.string().min(1),
  publication_date: z.string(), // YYYY-MM-DD or ISO
})

export type UpdateBookInput = z.infer<typeof UpdateBookSchema>
export type Book = z.infer<typeof bookSchema>
export type CreateBookInput = z.infer<typeof createBookSchema>
