const request = require('supertest');
const {
  getAuthHeader,
  loginAsAdmin,
  login,
  registerUser,
} = require('../config/test-utils');
const { TEST_CONFIG } = require('../config/test-setup');
const { createTestBook, createTestUser } = require('../setup/test-data');

/**
 * test suite for Books API endpoints
 * @description verifies access control and CRUD behavior for the Books collection,
 * including public read access, admin full access, and user ownership-based permissions.
 */
describe('Books API', () => {

  /**
   * Public access rules for Books
   * @description Verifies that unauthenticated users can read books
   * but are forbidden from creating records.
  */
  describe('Public Access', () => {
    test('should allow public read access to books', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .get('/items/books')
        .query({ limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    test('should return 403 for unauthorized create', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/items/books')
        .send(createTestBook());

      expect(response.status).toBe(403);
    });
  });
});
