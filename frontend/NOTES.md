# Library Management System - Technical Notes

## Known Issues and Workarounds

1. **Role Data in User Object**
   - **Issue**: Directus `/users/me` endpoint returns only role UUID by default
   - **Solution**: request role fields: `fields: ['*', 'role.id', 'role.name']`
   - **Location**: `app/stores/auth.ts`

2. **Limited Fields on Public Registration**
   - **Issue**: The standard SDK `registerUser` (and the underlying `/users/register` endpoint) only accepts email and password. Additional fields like `first_name` or `last_name` are ignored.
   - **Solution**: Implement a three-step flow:
     1. Register the user with credentials
     2. Log in immediately to obtain an active session
     3. Call `updateUser` using the newly created user ID to update profile data
   - **Location**: `app/stores/auth.ts`


## Best Practices

1. **Component Organization**
   - Group related components in feature folders
   - Keep components small and focused
   - Use TypeScript for type safety

2. **State Management**
   - Use Pinia for global state
   - Keep local state in components when possible
   - Use computed properties for derived state

3. **Error Handling**
   - Handle API errors gracefully
   - Show user-friendly error messages
   - Log errors for debugging


## Authentication Flow

### User Authentication
- **File**: `app/composables/auth/useAuth.ts`
- **Key Points**:
  - Uses `@directus/sdk` for authentication
  - Handles both registration and login flows
  - Automatically updates user profile after registration
  - Integrates with Pinia store for state management

### Role-Based Access Control (RBAC)
- **File**: `app/stores/auth.ts`
- **Key Points**:
  - Uses Directus roles for authorization
  - Fetches user with role details using: `fields: ['*', 'role.id', 'role.name']`
  - Role check example: `user.role.name === 'admin'`


### API Client
- **File**: `app/composables/auth/useAuth.ts`
- **Key Points**:
  - Creates separate clients for public/authenticated requests
  - Handles token refresh automatically
  - Implements error handling for API requests

## State Management

### Pinia Store
- **File**: `app/stores/auth.ts`
- **Key Points**:
  - Manages authentication state (guest, loading, authenticated)
  - Stores current user data
  - Provides actions for authentication operations

## Forms and Validation

### Form Handling
- **File**: `app/composables/utils/useForm.ts`
- **Key Points**:
  - Reusable form handling logic
  - Integration with Zod for validation
  - Error handling and submission state

## Testing

### E2E Testing
- **File**: `tests/e2e/auth.spec.ts`
- **Key Points**:
  - Tests authentication flows
  - Uses Playwright for browser automation
  - Mocks API responses for testing

## Performance Considerations

### Data Loading
- **File**: `app/composables/books/useBooks.ts`
- **Key Points**:
  - Implements pagination
  - Caches API responses
  - Handles loading states

### Image Handling
- **File**: `app/composables/utils/useFileUploader.ts`
- **Key Points**:
  - Handles file uploads to Directus
  - Validates file types and sizes
  - Shows upload progress

## Security

### Authentication
- Uses JWT tokens
- Token refresh mechanism
- Secure cookie storage

### Input Validation
- Server-side validation
- Client-side validation with Zod
- Sanitization of user inputs

## Deployment

### Docker
- **File**: `Dockerfile` and `docker-compose.yml`
- **Key Points**:
  - Multi-stage build for production
  - Environment variable configuration
  - Health checks

