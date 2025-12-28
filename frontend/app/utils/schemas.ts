// utils/schemas.ts
import { z } from 'zod'

export const RegisterSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const UpdateProfileSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
});

export const BookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  publication_date: z
    .string()
    .min(1, 'Publication date is required')
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: 'Invalid date',
    }),
  cover_photo: z.string().uuid().optional().or(z.literal('')),
  allow_comments: z.boolean().default(true)
})

export type BookFormValues = z.infer<typeof BookFormSchema>

export type RegisterInput = z.infer<typeof RegisterSchema>