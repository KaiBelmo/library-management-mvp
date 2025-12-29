# Library Management System

A modern, full-stack library management application built with Nuxt.js 4, Directus, and PostgreSQL. This system provides a comprehensive digital archive for managing book collections with user authentication, role-based access control, and real-time commenting features.

## Documentation

- **Frontend Documentation**: See [`frontend/README.md`](frontend/README.md)
- **Backend Documentation**: See [`backend/README.md`](backend/README.md)
- **Composables Documentation**: See [`frontend/app/composables/README.md`](frontend/app/composables/README.md)
- **Technical Notes**: See [`frontend/NOTES.md`](frontend/NOTES.md)

## Architecture Overview

This is a **monorepo** containing two main applications:

- **Frontend**: Modern Nuxt.js 4 + Typescript web application
- **Backend**: Directus headless CMS with PostgreSQL database
- **Containerized**: Full Docker Compose setup for development and production

##  Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation & Setup

1. **Clone the repository**:

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**:
   ```bash
   docker compose up -d
   ```

4. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8055
   - **Admin Panel**: http://localhost:8055/admin

## Features & Functionality

### Authentication System
- **User Registration**: Multi-step registration with email verification
- **Secure Login**: JWT-based authentication with role management
- **Profile Management**: Update user information and preferences
- **Role-Based Access**: Administrator and regular user roles

### Book Management
- **Create Books**: Add new volumes with cover images and metadata
- **Browse Collection**: Searchable, filterable book catalog
- **Edit & Update**: Modify existing book information
- **Delete Books**: Remove volumes with confirmation dialogs
- **Advanced Search**: Search by title, author, genre with date filtering
- **Pagination**: Efficient handling of large collections

### Comment System
- **Per-Book Comments**: Toggle comments on individual books
- **Real-time Updates**: Instant comment addition and deletion
- **User Attribution**: Track comment authors and timestamps
- **Permission Control**: Only authors or admins can delete comments

### User Management (Admin)
- **User Directory**: View all registered users
- **System Statistics**: Track total books and users
- **Admin Dashboard**: Centralized admin interface

## Tech Stack

### Frontend
- **Framework**: Nuxt.js 4 + TypeScript
- **UI Components**: Nuxt UI component library
- **Styling**: Tailwind CSS
- **State Management**: Pinia stores with composables
- **Form Validation**: Zod schemas for runtime validation
- **Image Handling**: Nuxt Image with lazy loading
- **Testing**: Playwright for E2E, Vitest for unit tests

### Backend
- **Headless CMS**: Directus 10+
- **Database**: PostgreSQL 15
- **Authentication**: JWT tokens with refresh mechanism
- **File Storage**: Directus file handling for book covers

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload with volume mounting
- **Production**: Multi-stage builds with health checks

## Data Model

### Books Collection
```typescript
interface Book {
  id: string              // UUID primary key
  title: string            // Book title (required, max 200 chars)
  author: string           // Author name (required, max 100 chars)
  genre: string            // Book genre (required, max 50 chars)
  publication_date: string // ISO datetime format
  cover_photo?: string     // UUID reference to uploaded image
  image?: string           // Processed full URL to cover image
  allow_comments: boolean  // Toggle comments per book
  user_created: string    // UUID of creator
  date_created: string    // Auto-managed timestamp
}
```

### Comments Collection
```typescript
interface Comment {
  id: string              // UUID primary key
  content: string          // Comment text
  author_name: string     // Display name for comments
  book_id: string         // Foreign key to books (cascade delete)
  user_created: string    // UUID of comment author
  date_created: string    // Auto-managed timestamp
}
```

### User Management
```typescript
interface User {
  id: string              // UUID primary key
  email: string           // Unique email address
  first_name?: string     // Optional first name
  last_name?: string      // Optional last name
  role: Role | string    // Role object or ID
  date_created: string    // Registration timestamp
}
```

## Security & Permissions

### Access Control Policies
- **Public Users**: Can read books and comments (no write access)
- **Authenticated Users**: Full CRUD on own books, can create comments
- **Administrators**: Full system access with user management

### Permission Rules
```json
{
  "books": {
    "create": "authenticated_users",
    "read": "public", 
    "update": "owner_only",
    "delete": "owner_only"
  },
  "comments": {
    "create": "authenticated_users",
    "read": "public",
    "delete": "author_or_admin"
  }
}
```

## Testing

### E2E Testing (Playwright)
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI for debugging
npm run test:ui
```

### Unit Testing (Vitest)
```bash
# Run unit tests
npm run test:unit

# Run all tests
npm run test:all
```

## Project Structure

```
library-management-mvp/
├── frontend/                    # Nuxt.js frontend application
│   ├── app/
│   │   ├── components/          # Vue components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── ui/            # Reusable UI components
│   │   │   └── profile/       # Profile-specific components
│   │   ├── composables/        # Vue composables (business logic)
│   │   │   ├── auth/          # Authentication logic
│   │   │   ├── books/         # Book management logic
│   │   │   ├── admin/         # Admin functionality
│   │   │   └── utils/         # Utility composables
│   │   ├── pages/              # File-based routing
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── stores/             # Pinia stores
│   │   └── assets/             # Static assets
│   ├── tests/                  # Test files
│   │   ├── e2e/             # End-to-end tests
│   │   └── unit/             # Unit tests
│   ├── nuxt.config.ts          # Nuxt configuration
│   └── package.json            # Frontend dependencies
├── backend/                     # Directus backend
│   ├── directus-config/          # Directus configuration
│   │   ├── collections/        # Data model definitions
│   │   ├── snapshot/           # Database snapshots
│   │   └── specs/              # API specifications
│   ├── seed/                   # Database seeding
│   ├── testing/                 # Backend tests
│   └── docker-compose.yml      # Backend services
├── docker-compose.yml             # Main orchestration
├── .env.example                 # Environment template
└── README.md                   # This file
```

## Development

### Environment Variables
Key environment variables (see `.env.example` for complete list):

## Deployment

### Production Deployment
```bash
# Build and deploy
docker compose -f docker-compose.yml up -d --build
```

### Health Checks
- **Database**: PostgreSQL health check on port 5432
- **Backend**: Directus ping endpoint on port 8055
- **Frontend**: Application available on port 3000
