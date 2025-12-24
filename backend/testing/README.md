# API Testing Suite

This directory contains tests for the Library Management System's API endpoints. The tests are written using Jest and Supertest to ensure the API behaves as expected.

## Test Files

### 1. `auth.test.js`
Tests authentication-related API endpoints including:
- User registration with duplicate email handling
- User login with valid and invalid credentials
- User profile access with valid authentication tokens

### 2. `books.test.js`
Tests the Books API endpoints with a focus on:
- Public read access to books
- Admin CRUD operations
- User-specific book management
- Proper access control and permissions

### 3. `comments.test.js`
Tests the Comments functionality including:
- Creating comments on books
- Public read access to comments
- Comment management and access control
- Association between books and comments

## Test Setup

### Prerequisites
- Node.js
- npm or yarn
- Access to a running instance of the Directus backend

### Configuration
Tests are configured using environment variables and the test configuration in `../config/`:
- `.env.example`: Template for environment variables (copy to `.env` and update values)
  - `DIRECTUS_URL`: URL of the Directus instance
  - `ADMIN_EMAIL`: Admin email for test authentication
  - `ADMIN_PASSWORD`: Admin password for test authentication
- `test-setup.js`: Contains test configuration including API endpoints and test data
- `test-utils.js`: Contains shared helpers for user registration, authentication, and authorization headers used in tests.
- `test-data.js`: Contains factory functions for generating test data

### Running Tests

To run all tests:
```bash
npm test
```

To run a specific test file:
```bash
npm test auth.test.js
```

To run tests with coverage:
```bash
npm test -- --coverage
```

## Test Data Management

- Test data is generated dynamically using factory functions for each test run

## Test Coverage

The test suite covers:
- Authentication flows
- CRUD operations for books and comments
- Access control and permissions
- Data validation
- Error handling

## Dependencies

- `jest`: Test framework
- `supertest`: HTTP assertions
- Other testing utilities from the project's `package.json`

## Notes

- The test suite is designed to work with the Directus headless CMS
- Environment-specific configurations should be managed through environment variables
