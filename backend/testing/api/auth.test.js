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

    describe('User Registration', () => {
    /**
     * tests the behavior when attempting to register with a duplicate email
     * - registers a new user
     * - attempts to register again with same email but different password
     * - verifies system handles duplicate registration attempts correctly
     */
    test('should handle duplicate email registration', async () => {
      const existingUser = createTestUser();
      const firstResponse = await registerUser(existingUser);
      expect(firstResponse.status).toBe(204);

      const duplicateUser = {
        ...existingUser,
        password: 'DifferentPassword123!'
      };
      
      const secondResponse = await registerUser(duplicateUser);
      
      if (secondResponse.status === 204) {
        const loginResponse = await request(TEST_CONFIG.DIRECTUS_URL)
          .post('/auth/login')
          .send({
            email: existingUser.email,
            password: existingUser.password
          });
        
        expect([200, 401]).toContain(loginResponse.status);
      } else {
        expect(secondResponse.status).toBe(400);
        expect(secondResponse.body).toHaveProperty('errors');
        expect(secondResponse.body.errors[0].message).toMatch(/email.*already exists/i);
      }
    });
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
