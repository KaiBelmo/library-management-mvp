const request = require('supertest');
const { TEST_CONFIG } = require('../config/test-setup');

describe('Auth API', () => {
  test('admin can login', async () => {
    console.log(TEST_CONFIG)
    const res = await request(TEST_CONFIG.DIRECTUS_URL)
      .post('/auth/login')
      .send({
        email: TEST_CONFIG.ADMIN_EMAIL,
        password: TEST_CONFIG.ADMIN_PASSWORD,
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('access_token');
  });
});
