import { z } from 'zod'
import type { LoginCredentials, RegisterInput } from '~/types'

/**
 * Authentication form composable with validation and error handling.
 * Specifically designed for authentication forms (login, register).
 * 
 * @template T - Form data type (LoginCredentials | RegisterInput)
 * @param {z.ZodSchema<T>} schema - Zod validation schema
 * @returns {Object} Form state and methods
 * @returns {Ref<boolean>} pending - Loading state
 * @returns {Ref<string>} errorMessage - Error message
 * @returns {Ref<string>} successMessage - Success message
 * @returns {Ref<Partial<Record<keyof T, string>>>} errors - Field validation errors
 * @returns {Function} validate - Validates form data
 * @returns {Function} runAction - Executes async actions with error handling
 */
export function useAuthForm<T extends LoginCredentials | RegisterInput>(schema: z.ZodSchema<T>) {
  const pending = ref(false)
  const errorMessage = ref("")
  const successMessage = ref("")
  const errors = ref<Partial<Record<keyof T, string>>>({})

  /**
   * Validates form data against schema.
   * @param {T} data - Form data to validate
   * @returns {boolean} True if valid
   */
  const validate = (data: T) => {
    errors.value = {}
    const result = schema.safeParse(data)
    if (!result.success) {
      const newErrors: Partial<Record<keyof T, string>> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof T
        newErrors[path] = issue.message
      })
      errors.value = newErrors
      return false
    }
    return true
  }

  /**
   * Executes async action with error handling.
   * @param {() => Promise<void>} action - Async function to execute
   * @returns {Promise<boolean>} True if succeeds
   */
  const runAction = async (action: () => Promise<void>) => {
    errorMessage.value = ""
    successMessage.value = ""
    pending.value = true
    try {
      await action()
      return true
    } catch (error: any) {

      const isNetworkError = 
        error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Network')) ||
        error.message && error.message.includes('Failed to fetch') ||
        error.message && error.message.includes('NetworkError') ||
        error.code === 'NETWORK_ERROR' ||
        error.type === 'network'
      
      if (isNetworkError) {
        errorMessage.value = "ARCHIVE UNREACHABLE. PLEASE TRY AGAIN LATER."
      } else if (error.data?.errors?.[0]?.message) {
        errorMessage.value = error.data.errors[0].message
      } else if (error.message) {
        errorMessage.value = error.message
      } else if (typeof error === 'string') {
        errorMessage.value = error
      } else {
        errorMessage.value = "PROTOCOL ERROR. PLEASE TRY AGAIN."
      }
      return false
    } finally {
      pending.value = false
    }
  }

  return { pending, errorMessage, successMessage, errors, validate, runAction }
}