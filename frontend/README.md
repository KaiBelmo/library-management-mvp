# Library Management System - Frontend

A modern web application for managing library resources, built with Nuxt.js 4, Nuxt ui, Directus and TypeScript. This frontend application provides a user-friendly interface for browsing, searching, and managing books in a library web app.

> **Composable Functions**: For logic and usage details, see the [Composables Documentation](./app/composables/README.md).

> **Technical Documentation**: For implementation details and architecture (some) decisions, see [NOTES.md](./NOTES.md).
## Functional Requirements

### Book Management

#### 1. Creating a New Book
- **Implementation**: `app/composables/books/useBookCrud.ts`
- **Components**: `app/components/ui/form/BookForm.vue`
- **How it works**:
  - Uses `createBook` function from `useBookCrud` composable
  - Handles form submission with validation
  - Supports file uploads for book covers
  - Updates the book list in real-time after creation

#### 2. Getting Book Information
- **Implementation**: `app/composables/books/useBookCrud.ts`
- **Components**: `app/components/ui/book/BookCard.vue`
- **How it works**:
  - `getBookById` function retrieves book details
  - Displays book information in a card format
  - Handles loading and error states

#### 3. Updating Book Information
- **Implementation**: `app/composables/books/useBookCrud.ts`
- **Components**: `app/components/ui/form/BookForm.vue`
- **How it works**:
  - Pre-fills form with existing book data
  - Uses the same form component as creation
  - Updates book details in the database and UI

#### 4. Deleting a Book
- **Implementation**: `app/composables/books/useBookCrud.ts`
- **Components**: `app/components/ui/book/BookCard.vue`
- **How it works**:
  - Confirms deletion with a dialog
  - Removes book from the database
  - Updates the UI to reflect changes

### Search and Filtering

#### 1. Book Search
- **Implementation**: `app/composables/books/useBookFilters.ts`
- **Features**:
  - Debounced search by title, author, and genre
  - Real-time results as you type
  - Case-insensitive matching

#### 2. Publication Date Filtering
- **Implementation**: `app/composables/books/useBookFilters.ts`
- **Features**:
  - Filter by date ranges
  - Sort by newest/oldest
  - Combines with other filters

### Comments on Books

#### Comment Toggle
- **Implementation**: `app/components/ui/book/BookComments.vue`
- **Features**:
  - Toggle comments on/off per book
  - State persisted in database

#### Comment Management

#### 1. Adding Comments
- **Implementation**: `app/composables/books/useBookComments.ts`
- **Components**: `app/components/ui/book/BookComments.vue`
- **Features**:
  - Form validation
  - Real-time updates
  - User attribution

#### 2. Viewing Comments
- **Implementation**: `app/composables/books/useBookComments.ts`
- **Features**:
  - Paginated comments
  - User avatars and timestamps
  - Nested replies support

#### 3. Deleting Comments
- **Implementation**: `app/composables/books/useBookComments.ts`
- **Security**:
  - Only comment author or admin can delete
  - Server-side validation
  - Confirmation dialog

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
