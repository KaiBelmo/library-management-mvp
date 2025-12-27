import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.boolean().default(false),
  date_created: z.string().datetime(),
})

export const createUserSchema = userSchema.partial({
  id: true,
  isAdmin: true,
  date_created: true,
})

export const updateUserSchema = createUserSchema.partial({
  password: true,
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(3, 'Password is required'),
})

export const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type User = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
