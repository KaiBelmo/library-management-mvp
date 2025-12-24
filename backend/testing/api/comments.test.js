const request = require('supertest');
const {
  getAuthHeader,
  loginAsAdmin,
  createAndLoginUser
} = require('../config/test-utils');
const { TEST_CONFIG } = require('../config/test-setup');
const { createTestBook, createTestUser, createTestComment } = require('../setup/test-data');

/**
 * Test suite for Comments API endpoints
 * @description Tests the functionality of the Comments API including CRUD operations
 */
describe('Comments API', () => {
  let adminToken;
  let testUserToken;
  let testBookId;
  let testCommentId;
  let testUserId;
  const testBook = createTestBook();
  const testUser = createTestUser();

  beforeAll(async () => {
    jest.setTimeout(60000);
    
    try {
      adminToken = await loginAsAdmin();
      
      const bookResponse = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/items/books')
        .set(getAuthHeader(adminToken))
        .send(testBook)
        .timeout(10000);
      testBookId = bookResponse.body.data.id;
      
      const user = await createAndLoginUser(testUser);
      testUserToken = user.token;
      
      const profileResponse = await request(TEST_CONFIG.DIRECTUS_URL)
        .get('/users/me')
        .set(getAuthHeader(testUserToken));
      
      testUserId = profileResponse.body.data.id;
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  }, 60000);

  /**
   * Cleans up test data after each test
   * @param {string} url - The API endpoint URL
   * @param {string} id - The ID of the resource to delete
   * @param {string} token - Authentication token
   */
  const cleanup = async (url, id, token) => {
    if (id) {
      await request(TEST_CONFIG.DIRECTUS_URL)
        .delete(`${url}/${id}`)
        .set(getAuthHeader(token));
    }
  };

  afterAll(async () => {
    await cleanup('/items/comments', testCommentId, adminToken);
    await cleanup('/items/books', testBookId, adminToken);
    await cleanup('/users', testUserId, adminToken);
  });

  /**
   * Test suite for creating comments
   * @description Tests the functionality of creating new comments
   */
  describe('Create Comment', () => {

    test('should allow authenticated user to create a comment', async () => {
      const testComment = createTestComment(testBookId, testUserId);
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/items/comments')
        .set(getAuthHeader(testUserToken))
        .send(testComment);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id');

      testCommentId = response.body.data.id;      
      testCommentId = response.body.data.id;
    });
  });

    /**
   * Test suite for reading comments
   * @description Tests the functionality of reading comments
   */
  describe('Read Comments', () => {
    test('should allow public read access to comments', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .get('/items/comments')
        .query({ 
          filter: JSON.stringify({ book_id: { _eq: testBookId } }),
          limit: 1 
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });

    /**
   * Test suite for updating comments
   * @description Tests the functionality of updating comments
   *  - verifies that regular users cannot update comments
   */
  describe('Update Comment', () => {
    test('should not allow users to update comments', async () => {
      const updatedContent = 'Attempted update';
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .patch(`/items/comments/${testCommentId}`)
        .set(getAuthHeader(testUserToken))
        .send({ 
          content: updatedContent,
          date_updated: new Date().toISOString()
        });

        expect(response.status).toBe(403);
    });
  });

});
