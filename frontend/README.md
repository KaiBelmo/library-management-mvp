# Library Management System - Frontend

A modern web application for managing library resources, built with Nuxt.js 3, Vue 3, and TypeScript. This frontend application provides a user-friendly interface for browsing, searching, and managing books in a library system.

> **Composable Functions**: For logic and usage details, see the [Composables Documentation](./app/composables/README.md).

## 🚀 Features

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
  - Track borrowed books
  - View reading history

- **Admin Dashboard**
  - User management
  - Book inventory management
  - System statistics

## 🛠️ Tech Stack

- **Frontend Framework**: Nuxt.js 3
- **UI Components**: Nuxt UI
- **State Management**: Pinia
- **Form Handling**: Vee-Validate
- **Type Checking**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Directus SDK
- **Form Validation**: Zod

## 📁 Project Structure

```
frontend/
├── app/
│   ├── components/     # Reusable Vue components
│   │   ├── auth/       # Authentication components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI components
│   │
│   ├── composables/    # Composable functions
│   │   ├── useAuth.ts  # Authentication logic
│   │   ├── useBooks.ts # Book-related logic
│   │   └── ...
│   │
│   ├── layouts/        # Layout templates
│   ├── middleware/     # Route middleware
│   ├── pages/          # Application pages
│   ├── plugins/        # Nuxt plugins
│   ├── schemas/        # Validation schemas
│   ├── stores/         # Pinia stores
│   └── utils/          # Utility functions
│
├── public/             # Static files
├── .env.example        # Environment variables example
├── nuxt.config.ts      # Nuxt configuration
└── package.json        # Project dependencies
```

