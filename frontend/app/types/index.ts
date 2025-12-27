export interface User {
  id: string
  name: string
  isAdmin: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface SearchParams {
  query?: string
  author?: string
  genre?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: 'title' | 'publication_date' | 'date_created'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DirectusResponse<T> {
  data: T[];
  meta?: {
    total_count?: number;
    filter_count?: number;
  };
}

// Composable interfaces
export interface AdminStats {
  totalBooks: number
  totalUsers: number
}

export interface UseAdminReturn {
  // State
  allUsers: Ref<any[]>
  adminStats: AdminStats
  
  // Computed
  isAdminUser: ComputedRef<boolean>
  
  // Admin functions
  loadRegistryData: () => Promise<void>
}

export interface UseUserReturn {
  // Computed
  isAuthenticated: ComputedRef<boolean>
  
  // Profile management
  updateProfile: (userId: string, profileData: any) => Promise<void>
}