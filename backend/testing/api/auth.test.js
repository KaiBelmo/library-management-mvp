const request = require('supertest');
const { 
  registerUser, 
  loginAsAdmin,
} = require('../config/test-utils');
const { TEST_CONFIG } = require('../config/test-setup');
const { createTestUser } = require('../setup/test-data');

/** Test user data for authentication tests */
const TEST_USER = createTestUser();

/**
 * Test suite for Authentication API endpoints
 * @description Tests the functionality of the Authentication API
 */
describe('Authentication API', () => {
  let adminToken;
  let testUserToken;

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    await registerUser(TEST_USER);
  });

  describe('User Login', () => {
    test('should login with valid credentials', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: TEST_USER.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('access_token');
      
      testUserToken = response.body.data.access_token;
    });

    test('should not login with invalid credentials', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/auth/login')
        .send({
          email: TEST_USER.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
    });
  });
});
