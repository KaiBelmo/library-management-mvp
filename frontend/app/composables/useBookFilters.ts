type SortBy = 'title' | 'publication_date' | 'date_created'
type SortOrder = 'asc' | 'desc'

/**
 * Book filters composable for search, filtering, and sorting functionality.
 * Manages filter state and builds API queries for Directus.
 * 
 * @returns {Object} Filter state and methods
 * @returns {Object} filters - Reactive filter state
 * @returns {Function} buildFilterQuery - Builds API filter query from current state
 * @returns {Function} resetFilters - Resets all filters to defaults
 * @returns {Function} setFilters - Updates multiple filters at once
 */
export const useBookFilters = () => {
  const filters = reactive({
    search: '',
    genre: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'title' as SortBy,
    sortOrder: 'asc' as SortOrder,
  })

  /**
   * Builds filter query for Directus API based on current filter state.
   * Combines search, genre, and date filters into a single API query object.
   * 
   * @returns {Object} Directus API filter query object
   * @returns {Object} [returns.filter] - Combined filter conditions if any filters are active
   * @returns {Object} [returns.sort] - Sort configuration
   */
  const buildFilterQuery = () => {
    const and = []

    if (filters.search) {
      and.push({
        _or: [
          { title: { _icontains: filters.search } },
          { author: { _icontains: filters.search } }
        ]
      })
    }
    if (filters.genre) {
      and.push({ genre: { _eq: filters.genre } })
    }

    if (filters.dateFrom) {
      and.push({ publication_date: { _gte: filters.dateFrom } })
    }
    if (filters.dateTo) {
      and.push({ publication_date: { _lte: filters.dateTo } })
    }

    const filterQuery = and.length ? { _and: and } : {}
    
    const sortQuery = filters.sortOrder === 'desc'
      ? `-${filters.sortBy}`
      : filters.sortBy

    console.log('DEBUG - Filter query built:', {
      currentFilters: filters,
      andConditions: and,
      finalFilterQuery: filterQuery,
      sortQuery
    })

    return {
      filter: filterQuery,
      sort: sortQuery,
    }
  }

  /**
   * Resets all filters to their default values.
   * Clears search, genre, date filters and resets sorting to defaults.
   */
  const resetFilters = () => {
    filters.search = ''
    filters.genre = ''
    filters.dateFrom = ''
    filters.dateTo = ''
    filters.sortBy = 'title'
    filters.sortOrder = 'asc'
  }

  /**
   * Updates multiple filters at once.
   * Useful for batch updates or applying filter presets.
   * 
   * @param {Partial<typeof filters>} newFilters - Partial filter object to merge
   */
  const setFilters = (newFilters: Partial<typeof filters>) => {
    Object.assign(filters, newFilters)
  }

  return {
    filters,
    buildFilterQuery,
    resetFilters,
    setFilters,
  }
}
