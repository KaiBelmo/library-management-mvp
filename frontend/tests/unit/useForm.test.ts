import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { useForm } from '@/composables/utils/useForm'

describe('useForm', () => {
  let mockSchema: z.ZodSchema<any>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validate', () => {
    it('should return true for valid data', () => {
      mockSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })

      const { validate, errors } = useForm(mockSchema)
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = validate(validData)

      expect(result).toBe(true)
      expect(errors.value).toEqual({})
    })

    it('should return false and set errors for invalid data', () => {
      mockSchema = z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      })

      const { validate, errors } = useForm(mockSchema)
      const invalidData = {
        email: 'invalid-email',
        password: '123',
      }

      const result = validate(invalidData)

      expect(result).toBe(false)
      expect(errors.value).toEqual({
        email: 'Invalid email format',
        password: 'Password must be at least 6 characters',
      })
    })

    it('should handle nested validation errors', () => {
      mockSchema = z.object({
        user: z.object({
          name: z.string().min(1, 'Name is required'),
        }),
      })

      const { validate, errors } = useForm(mockSchema)
      const invalidData = {
        user: { name: '' },
      }

      const result = validate(invalidData)

      expect(result).toBe(false)
      expect(errors.value).toEqual({
        user: 'Name is required',
      })
    })

    it('should clear previous errors before validation', () => {
      mockSchema = z.object({
        email: z.string().email(),
      })

      const { validate, errors } = useForm(mockSchema)
      
      // First validation with invalid data
      validate({ email: 'invalid' })
      expect(errors.value.email).toBeDefined()
      
      // Second validation with valid data
      const result = validate({ email: 'test@example.com' })
      
      expect(result).toBe(true)
      expect(errors.value).toEqual({})
    })
  })

  describe('runAction', () => {
    beforeEach(() => {
      mockSchema = z.object({
        email: z.string().email(),
      })
    })

    it('should execute action successfully and return true', async () => {
      const { runAction, pending, errorMessage, successMessage } = useForm(mockSchema)
      const mockAction = vi.fn().mockResolvedValue(undefined)

      const result = await runAction(mockAction)

      expect(result).toBe(true)
      expect(mockAction).toHaveBeenCalled()
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('')
      expect(successMessage.value).toBe('')
    })

    it('should handle network errors with specific message', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const networkError = new TypeError('Failed to fetch')
      const mockAction = vi.fn().mockRejectedValue(networkError)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('ARCHIVE UNREACHABLE. PLEASE TRY AGAIN LATER.')
    })

    it('should handle TypeError with Network in message', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const networkError = new TypeError('Network request failed')
      const mockAction = vi.fn().mockRejectedValue(networkError)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('ARCHIVE UNREACHABLE. PLEASE TRY AGAIN LATER.')
    })

    it('should handle error with NETWORK_ERROR code', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const networkError = { code: 'NETWORK_ERROR' }
      const mockAction = vi.fn().mockRejectedValue(networkError)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('ARCHIVE UNREACHABLE. PLEASE TRY AGAIN LATER.')
    })

    it('should handle error with network type', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const networkError = { type: 'network' }
      const mockAction = vi.fn().mockRejectedValue(networkError)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('ARCHIVE UNREACHABLE. PLEASE TRY AGAIN LATER.')
    })

    it('should handle Directus API errors with data.errors[0].message', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const apiError = {
        data: {
          errors: [{ message: 'Invalid credentials' }],
        },
      }
      const mockAction = vi.fn().mockRejectedValue(apiError)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('Invalid credentials')
    })

    it('should handle errors with message property', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const error = new Error('Something went wrong')
      const mockAction = vi.fn().mockRejectedValue(error)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('Something went wrong')
    })

    it('should handle string errors', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const stringError = 'String error message'
      const mockAction = vi.fn().mockRejectedValue(stringError)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('String error message')
    })

    it('should handle unknown errors with default message', async () => {
      const { runAction, pending, errorMessage } = useForm(mockSchema)
      const unknownError = { someProperty: 'someValue' }
      const mockAction = vi.fn().mockRejectedValue(unknownError)

      const result = await runAction(mockAction)

      expect(result).toBe(false)
      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('PROTOCOL ERROR. PLEASE TRY AGAIN.')
    })

    it('should set pending to true during execution', async () => {
      const { runAction, pending } = useForm(mockSchema)
      let resolveAction: (value?: any) => void
      
      const mockAction = vi.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          resolveAction = resolve
        })
      })

      const actionPromise = runAction(mockAction)
      
      expect(pending.value).toBe(true)
      
      resolveAction!()
      await actionPromise
      
      expect(pending.value).toBe(false)
    })

    it('should clear previous messages before execution', async () => {
      const { runAction, errorMessage, successMessage } = useForm(mockSchema)
      
      errorMessage.value = 'Previous error'
      successMessage.value = 'Previous success'
      
      const mockAction = vi.fn().mockResolvedValue(undefined)
      await runAction(mockAction)

      expect(errorMessage.value).toBe('')
      expect(successMessage.value).toBe('')
    })
  })

  describe('form state', () => {
    it('should initialize with default state', () => {
      mockSchema = z.object({})
      const { pending, errorMessage, successMessage, errors } = useForm(mockSchema)

      expect(pending.value).toBe(false)
      expect(errorMessage.value).toBe('')
      expect(successMessage.value).toBe('')
      expect(errors.value).toEqual({})
    })

    it('should work with generic types', () => {
      interface TestForm {
        name: string
        age: number
      }

      const testSchema: z.ZodSchema<TestForm> = z.object({
        name: z.string(),
        age: z.number(),
      })

      const { validate } = useForm<TestForm>(testSchema)
      
      const result = validate({ name: 'John', age: 25 })
      expect(result).toBe(true)
    })
  })
})
