import { z } from 'zod'

export const commentSchema = z.object({
  id: z.string(),
  content: z.string(),
  author_name: z.string(),
  book_id: z.string(),
  user_created: z.string(),
  date_created: z.string().optional(),
})

export const createCommentSchema = commentSchema.partial({
  id: true,
  user_created: true,
  date_created: true,
})
export type Comment = z.infer<typeof commentSchema>

export type CreateCommentInput = z.infer<typeof createCommentSchema>
