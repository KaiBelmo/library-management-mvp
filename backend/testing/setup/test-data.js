const { v4: uuid } = require('uuid');

const createTestUser = () => ({
  email: `test-${uuid().slice(0, 6)}@testing.com`,
  password: 'TestPass123!',
  first_name: 'Test',
  last_name: 'User',
});

module.exports = { createTestUser };
