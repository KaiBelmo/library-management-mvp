const request = require('supertest');
const { TEST_CONFIG } = require('./test-setup');

const login = async (email, password) => {
  const response = await request(TEST_CONFIG.DIRECTUS_URL)
    .post('/auth/login')
    .send({ email, password });
  if (response.status !== 200 || !response.body?.data?.access_token) {
    console.error('Login failed:', response.status, response.body);
    throw new Error(`Login failed for ${email}: ${response.status}`);
  }
  return response.body.data.access_token;
};

const loginAsAdmin = async () => {
  return await login(TEST_CONFIG.ADMIN_EMAIL, TEST_CONFIG.ADMIN_PASSWORD);
};

const registerUser = async (userData) => {
  return await request(TEST_CONFIG.DIRECTUS_URL)
    .post('/users/register')
    .send({
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name
    });
};

const getAuthHeader = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

const createAndLoginUser = async (userData) => {
  await registerUser(userData);
  
  const token = await login(userData.email, userData.password);
  
  return {
    email: userData.email,
    password: userData.password,
    token
  };
};

module.exports = {
  login,
  loginAsAdmin,
  registerUser,
  getAuthHeader,
  createAndLoginUser
};
