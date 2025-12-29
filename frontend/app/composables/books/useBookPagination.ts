/**
 * Pagination utilities composable for book management.
 * Provides common pagination functions and state management.
 * 
 * @returns {Object} Pagination utilities and state
 * @returns {Function} calculatePagination - Calculates pagination metadata
 * @returns {Function} getPageItems - Gets items for specific page
 * @returns {Function} createPaginationState - Creates reactive pagination state
 */

/**
 * Calculates pagination metadata based on total items and limit.
 * @param {number} totalItems - Total number of items
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata with total and totalPages
 */
export const calculatePagination = (totalItems: number, limit: number) => ({
  total: totalItems,
  totalPages: Math.ceil(totalItems / limit),
})

/**
 * Gets a subset of items for a specific page.
 * @template T
 * @param {T[]} items - Array of items to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {T[]} Items for the specified page
 */
export const getPageItems = <T>(items: T[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return items.slice(startIndex, endIndex)
}

/**
 * Creates reactive pagination state with default values.
 * @param {number} defaultLimit - Default items per page
 * @returns {Object} Reactive pagination state
 */
export const createPaginationState = (defaultLimit: number = 10) => reactive({
  page: 1,
  limit: defaultLimit,
  total: 0,
  totalPages: 0,
})

/**
 * Resets pagination state to initial values.
 * @param {Object} pagination - Pagination state object to reset
 */
export const resetPagination = (pagination: any) => {
  pagination.page = 1
  pagination.total = 0
  pagination.totalPages = 0
}
