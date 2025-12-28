# Composable Functions

This directory contains Vue 3 composable functions that encapsulate and reuse stateful logic across components. These composables follow the Composition API pattern and are designed to be used with the `use` prefix.

## Available Composables

### `useAuth.ts`
Manages authentication state, login/logout functionality, and user session.

#### Important Implementation Note

The `registerAndLogin` function implements a workaround for Directus API's default registration behavior. Here's why it's needed:

1. **Directus Limitation**: The Directus register API only creates a user with email and password, without assigning a role or additional user details.

2. **The Workaround**:
   ```typescript
   const registerAndLogin = async (data: RegisterInput) => {
     try {
       // 1. Register the user with just email and password
       await registerClient.request(registerUser(data.email, data.password));
       
       // 2. Log the user in immediately
       await login({
         email: data.email,
         password: data.password,
       });
       
       // 3. After successful login, update the user's profile with additional details
       if (user.value && user.value.id) {
         await updateUser({
           id: user.value.id,
           user: {
             first_name: data.first_name,
             last_name: data.last_name,
           }
         });
         
         // 4. Refresh the auth state to ensure all user data is up-to-date
         await authStore.hydrateAuthState();
       }
     } catch (error) {
       throw error;
     }
   }
   ```

3. **Why This Approach?**
   - Ensures user profiles have all necessary information (first name, last name)
   - Maintains a consistent user experience by handling registration and profile setup in one flow
   - Works around Directus's default behavior of not allowing additional fields during registration

### `useAdmin.ts`

Handles admin-specific functionality including user management and system statistics.

#### Key Features:

1. **Admin Statistics**: Tracks total books and users in the system
2. **User Directory**: Provides access to all registered users
3. **Admin-Only Operations**: Ensures admin privileges for sensitive operations


### `useAuthForm.ts`
Provides form handling and validation for authentication forms.

#### Key Function: `runAction`

This function is a robust error handling wrapper for authentication form submissions. It standardizes error handling and user feedback across all authentication flows.

```typescript
const runAction = async (action: () => Promise<void>) => {
  // Reset messages and set pending state
  errorMessage.value = ""
  successMessage.value = ""
  pending.value = true
  
  try {
    await action()
    return true
  } catch (error: any) {
    // Detect network-related errors
    const isNetworkError = 
      error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Network')) ||
      error.message && error.message.includes('Failed to fetch') ||
      error.message && error.message.includes('NetworkError') ||
      error.code === 'NETWORK_ERROR' ||
      error.type === 'network'
    
    // Handle different types of errors with appropriate user feedback
    if (isNetworkError) {
      errorMessage.value = "ARCHIVE UNREACHABLE. PLEASE TRY AGAIN LATER."
    } else if (error.data?.errors?.[0]?.message) {
      // Handle API validation errors
      errorMessage.value = error.data.errors[0].message
    } else if (error.message) {
      // Handle standard error objects with message
      errorMessage.value = error.message
    } else if (typeof error === 'string') {
      // Handle string errors
      errorMessage.value = error
    } else {
      // Fallback for unknown errors
      errorMessage.value = "PROTOCOL ERROR. PLEASE TRY AGAIN."
    }
    return false
  } finally {
    // Always reset the pending state
    pending.value = false
  }
}
```

**Key Features**:

1. **Consistent Error Handling**: Standardizes error handling across all authentication forms
2. **Network Error Detection**: Specifically identifies network-related issues
3. **User-Friendly Messages**: Provides clear, actionable feedback to users
4. **Loading State Management**: Handles the `pending` state automatically
5. **Type Safety**: Uses TypeScript for better error type handling


### `useBookComments.ts`

Manages book comment functionality including fetching, adding, and removing comments.

#### Key Features:

1. **Comment Management**: Fetch, add, and delete comments
2. **Real-time Updates**: Reactive comments array
3. **User Attribution**: Tracks comment authors and timestamps



### `useBookCrud.ts`

Provides comprehensive CRUD operations for books with image handling.

#### Key Features:

1. **Full CRUD Operations**: Create, read, update, and delete books
2. **Image Handling**: Upload and process book cover images
3. **Type Safety**: Strong TypeScript types for book data
4. **Error Handling**: Consistent error handling for all operations


### `useBookFilters.ts`
Handles filtering and searching of books.

### `useBookGenres.ts`
Manages book genre-related functionality.

### `useBookPagination.ts`
Handles pagination logic for book listings.

### `useBooks.ts`
Core book-related functionality and state management.

### `useBookUtils.ts`
Utility functions related to book operations.

### `useFileUpload.ts`
Handles file upload functionality, including preview and validation.

### `useForm.ts`
Generic form handling and validation utilities.

### `useUser.ts`
Manages user-related data and operations.

### `useUserBooks.ts`
Handles operations related to user's book collection.

## Best Practices Followed

- Keep composables focused on a single responsibility
- Use TypeScript for better type safety
- Handle errors appropriately
- Document the composable's purpose, parameters, and return values
- Consider using the `try/catch` pattern for async operations
- Return reactive objects to maintain reactivity in components
