# Composable Functions

This directory contains Vue 3 composable functions that encapsulate and reuse stateful logic across components. These composables follow the Composition API pattern and are designed to be used with the `use` prefix.

## Architecture & Design Patterns

### Core Design Principles
- **Single Responsibility**: Each composable focuses on one specific domain (auth, books, admin, etc.)
- **Composition over Inheritance**: Composables are composed together to create complex functionality
- **Reactive State Management**: Uses Vue 3's reactivity system for state management
- **Type Safety**: Comprehensive TypeScript typing for better development experience
- **Error Handling**: Consistent error handling patterns across all composables
- **Separation of Concerns**: Clear separation between data fetching, state management, and UI logic

### Key Patterns Used

#### 1. **Facade Pattern** (`useBooks.ts`)
The main `useBooks` composable acts as a facade, combining multiple smaller composables:
```typescript
export const useBooks = () => {
  const bookCrud = useBookCrud()
  const bookFilters = useBookFilters()
  const bookGenres = useBookGenres()
  const userBooks = useUserBooks()
  // Combines all functionality into a single interface
}
```

#### 2. **Repository Pattern** (`useBookCrud.ts`)
Encapsulates data access logic for CRUD operations:
```typescript
const getById = async (id: string): Promise<Book> => {
  // Abstracts the direct API calls
  const book = await getItemById<Book>({ collection: 'books', id })
  return processBookImages([book])[0]!
}
```

#### 3. **Strategy Pattern** (`useBookFilters.ts`)
Implements different filtering strategies that can be combined:
```typescript
const buildFilterQuery = () => {
  const and = []
  // Different filter strategies
  if (filters.search) { /* search strategy */ }
  if (filters.genre) { /* genre strategy */ }
  if (filters.dateFrom) { /* date strategy */ }
}
```

#### 4. **Template Method Pattern** (`useAuthForm.ts` & `useForm.ts`)
Provides a template for form handling with customizable validation:
```typescript
const runAction = async (action: () => Promise<void>) => {
  // Template: setup -> execute -> cleanup
  pending.value = true
  try {
    await action()
    return true
  } catch (error) {
    // Standardized error handling
  } finally {
    pending.value = false
  }
}
```

#### 5. **Observer Pattern** (Reactive State)
All composables use Vue's reactivity to observe state changes:
```typescript
const books = ref<Book[]>([])
const filters = reactive({ search: '', genre: '' })
const isAdminUser = computed(() => authStore.isAdmin)
```

## Available Composables

### Authentication Module

#### `useAuth.ts`
**Purpose**: Core authentication functionality including registration, login, and logout.

**Key Design Decisions**:
- **Workaround Pattern**: Implements a clever workaround for Directus API limitations
- **Two-Step Registration**: Register user → Login → Update profile
- **Client Management**: Uses separate REST client for registration operations

**Important Implementation Details**:
```typescript
const registerAndLogin = async (data: RegisterInput) => {
  // 1. Check for existing users
  const existingUsers = await registerClient.request(readUsers({
    filter: { email: { _eq: data.email } }
  }))
  
  // 2. Register with basic credentials
  await registerClient.request(registerUser(data.email, data.password))
  
  // 3. Login immediately
  await login({ email: data.email, password: data.password })
  
  // 4. Update profile with additional data
  if (user.value && user.value.id) {
    await updateUser({
      id: user.value.id,
      user: { first_name: data.first_name, last_name: data.last_name }
    })
  }
}
```

**Why This Approach?**
- Directus registration API only accepts email/password
- Profile updates require authentication first
- Ensures data consistency and proper user session

#### `useAuthForm.ts`
**Purpose**: Specialized form handling for authentication with validation.

**Design Pattern**: Template Method with network error detection
```typescript
const runAction = async (action: () => Promise<void>) => {
  // Sophisticated error detection
  const isNetworkError = 
    error.name === 'TypeError' && (error.message.includes('fetch')) ||
    error.message?.includes('Failed to fetch') ||
    error.code === 'NETWORK_ERROR'
  
  if (isNetworkError) {
    errorMessage.value = "ARCHIVE UNREACHABLE. PLEASE TRY AGAIN LATER."
  }
}
```

**Key Features**:
- **Generic Type Support**: Works with both LoginCredentials and RegisterInput
- **Zod Validation Integration**: Schema-based validation
- **Network Error Detection**: Special handling for connectivity issues
- **User-Friendly Messages**: Clear, actionable error messages

#### `useUser.ts`
**Purpose**: User profile management and authentication state.

**Pattern**: State Management with computed properties
```typescript
const isAuthenticated = computed(() => authStore.status === 'authenticated')

const updateProfile = async (userId: string, profileData: any) => {
  await updateUser({ id: userId, user: profileData })
  // Optimistic update for current user
  if (authStore.user?.id === userId) {
    Object.assign(authStore.user, profileData)
  }
}
```

### Admin Module

#### `useAdmin.ts`
**Purpose**: Admin-specific functionality with privilege checking.

**Design Pattern**: Role-Based Access Control
```typescript
const isAdminUser = computed(() => authStore.isAdmin)

const loadRegistryData = async () => {
  if (!isAdminUser.value) return // Guard clause
  
  // Admin-only operations
  const users = await getUsers({ params: { fields: ['id', 'first_name', 'last_name', 'email'] } })
}
```

**Key Features**:
- **Privilege Checking**: Computed property for admin status
- **Error Recovery**: Graceful fallback on API failures
- **Statistics Aggregation**: Combines data from multiple sources

### Books Module

#### `useBooks.ts` (Facade)
**Purpose**: Main entry point combining all book functionality.

**Pattern**: Facade Pattern - hides complexity
```typescript
export const useBooks = () => {
  const bookCrud = useBookCrud()
  const bookFilters = useBookFilters()
  const bookGenres = useBookGenres()
  const userBooks = useUserBooks()
  
  // Unified interface
  return {
    books,
    genres: bookGenres.genres,
    filters: bookFilters.filters,
    // Expose methods from all sub-composables
    getById: bookCrud.getById,
    create: bookCrud.create,
    fetchGenres: bookGenres.fetchGenres,
    fetchUserBooks: userBooks.fetchUserBooks,
  }
}
```

**Benefits**:
- **Simplified API**: Single import for all book functionality
- **Consistent State**: Centralized state management
- **Easy Composition**: Components get everything they need from one source

#### `useBookCrud.ts` (Repository)
**Purpose**: Low-level CRUD operations for books.

**Pattern**: Repository Pattern with error handling
```typescript
const create = async (data: CreateBookInput): Promise<Book> => {
  loading.value = true
  try {
    const createdBooks = await createItems<Book>({
      collection: 'books',
      items: [data],
    })
    return processBookImages([createdBooks[0]])[0]!
  } catch (error) {
    // Detailed error logging
    console.error('Failed to create book:', err.message || 'Unknown error')
    throw error
  } finally {
    loading.value = false
  }
}
```

**Key Features**:
- **Consistent Loading States**: Unified loading management
- **Error Recovery**: Detailed error logging and re-throwing
- **Data Processing**: Automatic image URL processing

#### `useBookFilters.ts` (Strategy)
**Purpose**: Dynamic filtering and sorting capabilities.

**Pattern**: Strategy Pattern with query building
```typescript
const buildFilterQuery = () => {
  const and = []
  
  // Different filter strategies
  if (filters.search) {
    and.push({
      _or: [
        { title: { _icontains: filters.search } },
        { author: { _icontains: filters.search } }
      ]
    })
  }
  
  return {
    filter: and.length ? { _and: and } : {},
    sort: filters.sortOrder === 'desc' ? `-${filters.sortBy}` : filters.sortBy
  }
}
```

**Design Benefits**:
- **Composable Filters**: Multiple filters can be combined
- **API Agnostic**: Generates queries compatible with Directus
- **Reactive Updates**: Changes automatically trigger new queries

#### `useBookGenres.ts` (Service)
**Purpose**: Genre management and extraction.

**Pattern**: Service Pattern with data transformation
```typescript
const extractGenresFromBooks = (books: any[]): string[] => {
  const allGenres = books
    .map(book => book.genre)
    .filter(genre => genre && genre.trim() !== '')
  
  return [...new Set(allGenres)].sort() // Deduplication and sorting
}
```

**Key Features**:
- **Data Extraction**: Derives genres from existing books
- **Deduplication**: Removes duplicate genres
- **Caching**: Reactive storage for genre list

#### `useBookPagination.ts` (Utility)
**Purpose**: Pagination utilities and state management.

**Pattern**: Utility Functions with factory pattern
```typescript
export const createPaginationState = (defaultLimit: number = 10) => reactive({
  page: 1,
  limit: defaultLimit,
  total: 0,
  totalPages: 0,
})

export const calculatePagination = (totalItems: number, limit: number) => ({
  total: totalItems,
  totalPages: Math.ceil(totalItems / limit),
})
```

**Benefits**:
- **Reusable**: Can be used across different modules
- **Consistent**: Standard pagination behavior
- **Flexible**: Configurable limits and defaults

#### `useBookComments.ts` (Domain Service)
**Purpose**: Comment management with permission checking.

**Pattern**: Domain-Driven Design with aggregate root
```typescript
export const useBookComments = (bookId: string) => {
  // Aggregate root: manages comments for a specific book
  const fetchComments = async () => {
    // Parallel API calls for performance
    const [bookResponse, commentsResponse] = await Promise.all([
      getItemById<Book>({ id: bookId, fields: ['allow_comments'] }),
      getItems<Comment[]>({ filter: { book_id: { _eq: bookId } } })
    ])
    
    canComment.value = bookResponse?.allow_comments ?? false
  }
}
```

**Key Features**:
- **Permission Checking**: Validates comment permissions
- **Parallel Requests**: Optimized API calls
- **Aggregate Pattern**: Manages all comments for one book

#### `useUserBooks.ts` (Specialized Repository)
**Purpose**: User-specific book management with pagination.

**Pattern**: Specialized Repository with caching
```typescript
const fetchUserBooks = async (userId: string): Promise<Book[]> => {
  // Fetches all books for internal processing
  const userData = await getItems<Book>({
    params: { filter: { user_created: { _eq: userId } } }
  })
  
  return processBookImages(userData)
}

const loadUserBooks = async (userId: string) => {
  const allBooks = await fetchUserBooks(userId)
  // Apply pagination for display
  userBooks.value = getPageItems(allBooks, userBooksPagination.page, limit)
}
```

**Design Benefits**:
- **Separation of Concerns**: Fetching vs. display logic
- **Efficient Pagination**: Client-side pagination after fetch
- **State Management**: Tracks expansion and loading states

### Utils Module

#### `useBookUtils.ts` (Helper)
**Purpose**: Shared utility functions for book processing.

**Pattern**: Helper Functions with pure functions
```typescript
const processBookImages = (books: Book[]) => {
  return books.map((book) => {
    const imageUrl = book.cover_photo
      ? `${config.public.directusUrl}/assets/${book.cover_photo}`
      : undefined
    
    return { ...book, image: imageUrl, cover_photo: book.cover_photo }
  })
}
```

**Benefits**:
- **Pure Functions**: Predictable, testable functions
- **Configuration Integration**: Uses runtime config
- **Image Processing**: Centralized URL transformation

#### `useFileUploader.ts` (Service)
**Purpose**: File upload with preview and error handling.

**Pattern**: Service Pattern with state management
```typescript
const handleFileChange = async (event: Event): Promise<string | null> => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return null

  // Create preview immediately for better UX
  previewUrl.value = URL.createObjectURL(file)
  
  try {
    const uploaded = await uploadFiles(file)
    return Array.isArray(uploaded) ? uploaded[0]?.id : uploaded?.id
  } catch (err) {
    // Comprehensive error handling
    errorMessage.value = err.data?.errors?.[0]?.message || 'Failed to upload file'
    return null
  }
}
```

**Key Features**:
- **Immediate Preview**: Better user experience
- **Error Handling**: Multiple error source handling
- **Memory Management**: Proper URL cleanup

#### `useForm.ts` (Generic Template)
**Purpose**: Generic form handling with validation.

**Pattern**: Generic Template Method
```typescript
export function useForm<T = any>(schema: z.ZodSchema<T>) {
  const validate = (data: T) => {
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
}
```

**Benefits**:
- **Generic Type Support**: Works with any form type
- **Zod Integration**: Schema-based validation
- **Reusable**: Can be used across the application

## Best Practices Followed

### Code Organization
- **Single Responsibility**: Each composable has one clear purpose
- **Dependency Injection**: Composables declare their dependencies
- **Consistent Naming**: All composables use `use` prefix
- **Logical Grouping**: Related composables are in subdirectories

### Error Handling
- **Consistent Patterns**: All async operations use try/catch
- **User-Friendly Messages**: Clear error messages for users
- **Logging**: Comprehensive error logging for debugging
- **Graceful Degradation**: Fallback values and states

### Performance
- **Lazy Loading**: Composables are created when needed
- **Parallel Requests**: Multiple API calls run in parallel
- **Reactive Optimizations**: Computed properties for expensive operations
- **Memory Management**: Proper cleanup and URL revocation

### Type Safety
- **Comprehensive Typing**: All functions and return values are typed
- **Generic Types**: Flexible type parameters where needed
- **Schema Validation**: Zod schemas for runtime validation
- **Interface Contracts**: Clear interfaces for all composables

### Testing Considerations
- **Pure Functions**: Utility functions are easily testable
- **Dependency Injection**: Easy to mock dependencies
- **State Isolation**: Each composable manages its own state
- **Error Scenarios**: Comprehensive error handling for testing

## Usage Examples

### Basic Usage
```typescript
// In a Vue component
const { books, fetchBooks, loading } = useBooks()
const { user, isAuthenticated } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    fetchBooks()
  }
})
```

### Composition
```typescript
// Combining multiple composables
const { create: createBook } = useBooks()
const { validate, runAction } = useAuthForm(bookSchema)

const handleSubmit = async () => {
  if (!validate(bookData)) return
  
  await runAction(async () => {
    await createBook(bookData)
  })
}
```

### Advanced Usage
```typescript
// Custom composable that uses others
export function useBookManagement() {
  const books = useBooks()
  const auth = useAuth()
  const admin = useAdmin()
  
  const canEditBook = (book: Book) => {
    return auth.user.value?.id === book.user_created || admin.isAdminUser.value
  }
  
  return {
    ...books,
    canEditBook,
  }
}
```

This architecture provides a solid foundation for the library management system, with clear separation of concerns, excellent reusability, and comprehensive error handling.
