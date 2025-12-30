# Library Management System - Frontend

A modern, mobile-responsive web application for managing library resources, built with Nuxt.js 4, Nuxt UI, Directus, and TypeScript. This frontend application provides a user-friendly interface for browsing, searching, and managing books across all device sizes with optimized image loading for better performance.

> **Composable Functions**: For logic and usage details, see the [Composables Documentation](./docs/COMPOSABLES-README.md).

> **Technical Documentation**: For implementation details and architecture (some) decisions, see [NOTES.md](./docs/NOTES.md).
## Functional Requirements

### Book Management
For detailed implementation information, see the [Composables Documentation](./docs/COMPOSABLES-README.md#books-module).

- **Creating Books**: Add new books with cover images and metadata
- **Book Information**: View detailed book information and descriptions  
- **Updating Books**: Edit existing book details and metadata
- **Deleting Books**: Remove books with confirmation dialogs

### Search and Filtering
For detailed implementation information, see the [Composables Documentation](./docs/COMPOSABLES-README.md#books-module).

- **Book Search**: Real-time search by title, author, and genre
- **Date Filtering**: Filter books by publication date ranges
- **Sorting**: Sort by title, publication date, or creation date

### Comments on Books
For detailed implementation information, see the [Composables Documentation](./docs/COMPOSABLES-README.md#books-module).

- **Comment Toggle**: Enable/disable comments per book
- **Adding Comments**: Form validation and real-time updates
- **Viewing Comments**: Paginated display with user attribution
- **Deleting Comments**: Author/admin permissions with confirmation

## Features

- **User Authentication**
  - User registration and login
  - Protected routes
  - JWT-based authentication

- **Book Management**
  - Browse and search books
  - Add new books
  - Edit and delete existing books
  - Book details with descriptions

- **User Profile**
  - View and update profile information
  - Track your own books

- **Admin Dashboard**
  - User management
  - System statistics

## Tech Stack

- **Frontend Framework**: Nuxt.js 4
- **UI Components**: Nuxt UI
- **State Management**: Pinia
- **Type Checking**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Directus SDK
- **Form Validation**: Zod
- **Utilities**: VueUse

## Performance & Optimization

### Mobile-First Responsive Design
- Fully responsive layout that adapts to all screen sizes
- Fluid typography and spacing for optimal readability
- Touch-friendly interactive elements
- Optimized navigation for mobile devices
- Responsive grid system for book listings

### Image Optimization
- Lazy loading for offscreen images
- Proper aspect ratio handling to prevent layout shifts
- Blur-up placeholders during image loading

### Performance Features
- Code splitting and lazy loading of components
- Efficient state management with Pinia
- Optimized build output for production


## End-to-End Testing

This project uses Playwright for end-to-end testing. For detailed testing information and architecture, see the [Composables Documentation](./docs/COMPOSABLES-README.md#testing-considerations).

### Running Tests

1. **Prerequisites**:
   - Node.js and npm installed
   - Application running in development mode
   - Test database with seed data

2. **Run all tests**:
   ```bash
   npm run test:e2e
   ```

3. **Run in UI mode** (for debugging):
   ```bash
   npx playwright test --ui
   ```

### Test Coverage

- **Authentication Flows**
  - User registration
  - Login with valid/invalid credentials
  - Session management
  - Protected route access

### Writing Tests

Tests are located in `tests/e2e/` with the following structure:
- `auth.spec.ts` - Authentication related tests
- `test-utils.ts` - Shared test utilities and mocks


## Project Structure

```
frontend/
├── app/
│   ├── assets/         # Static assets (images, styles, etc.)
│   │   └── css/        # Global styles
│   │
│   ├── components/     # Reusable Vue components
│   │   ├── auth/       # Authentication components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI components
│   │
│   ├── composables/    # Composable functions
│   │   ├── auth/       # Auth-related composables
│   │   ├── books/      # Book-related composables
│   │   └── utils/      # Utility composables
│   │
│   ├── layouts/        # Layout templates
│   ├── middleware/     # Route middleware
│   ├── pages/          # Application pages
│   ├── plugins/        # Nuxt plugins
│   ├── schemas/        # Validation schemas (Zod)
│   ├── stores/         # Pinia stores
│   └── utils/          # Utility functions
│
├── tests/              # Test files
│   ├── e2e/           # End-to-end tests (Playwright)
│   └── unit/          # Unit tests (Vitest)
│
├── public/             # Static files served at root
├── .env.example        # Environment variables example
├── .gitignore         # Git ignore rules
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── eslint.config.mjs  # ESLint configuration
├── NOTES.md           # Technical notes and architecture decisions
├── nuxt.config.ts     # Nuxt configuration
├── package.json       # Project dependencies and scripts
├── playwright.config.ts # Playwright test config
└── tsconfig.json      # TypeScript configuration
```
