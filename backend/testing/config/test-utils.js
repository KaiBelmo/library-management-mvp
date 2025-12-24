const request = require('supertest');
const { TEST_CONFIG } = require('./test-setup');

const login = async (email, password) => {
  const response = await request(TEST_CONFIG.DIRECTUS_URL)
    .post('/auth/login')
    .send({ email, password });
  return response.body.data.access_token;
};

const loginAsAdmin = async () => {
  return await login(TEST_CONFIG.ADMIN_EMAIL, TEST_CONFIG.ADMIN_PASSWORD);
};

module.exports = {
  login,
  loginAsAdmin,
};
