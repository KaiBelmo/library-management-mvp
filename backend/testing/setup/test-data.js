const { v4: uuid } = require('uuid');

const createTestUser = () => ({
  email: `test-${uuid().slice(0, 6)}@testing.com`,
  password: 'TestPass123!',
  first_name: 'Test',
  last_name: 'User',
});

const createTestBook = () => {
  const currentDate = new Date();
  return {
    title: `Test Book ${Math.floor(Math.random() * 1000)}`,
    author: 'Test Author',
    genre: 'Fiction',
    publication_date: currentDate.toISOString()
  };
};


module.exports = { createTestUser, createTestBook };
