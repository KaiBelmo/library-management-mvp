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

const createTestComment = (bookId, user) => {
  if (!bookId) throw new Error('bookId is required');
  if (!user) throw new Error('user object is required');
  
  return {
    book_id: bookId,
    author_name: `${user.first_name} ${user.last_name}`.trim(),
    content: 'This is a test comment',
  };
};

module.exports = { createTestUser, createTestBook, createTestComment };
