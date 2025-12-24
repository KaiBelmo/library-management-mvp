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
  let adminToken;
  let adminBookId;

  let userToken;
  let otherUserToken;
  let userBookId;
  let otherUserBookId;

  const adminBook = createTestBook();
  const user = createTestUser();
  const otherUser = createTestUser();

  beforeAll(async () => {
    adminToken = await loginAsAdmin();

    await registerUser(user);
    await registerUser(otherUser);

    userToken = await login(user.email, user.password);
    otherUserToken = await login(otherUser.email, otherUser.password);
  });

  afterAll(async () => {
    if (adminBookId) {
      await request(TEST_CONFIG.DIRECTUS_URL)
        .delete(`/items/books/${adminBookId}`)
        .set(getAuthHeader(adminToken));
    }

    if (userBookId) {
      await request(TEST_CONFIG.DIRECTUS_URL)
        .delete(`/items/books/${userBookId}`)
        .set(getAuthHeader(userToken));
    }

    if (otherUserBookId) {
      await request(TEST_CONFIG.DIRECTUS_URL)
        .delete(`/items/books/${otherUserBookId}`)
        .set(getAuthHeader(otherUserToken));
    }
  });

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

  /**
   * Administrative access rules for Books
   * @description Ensures administrators have full CRUD permissions
   * on the Books collection.
  */
  describe('Admin Access', () => {
    test('should allow admin to create a book', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/items/books')
        .set(getAuthHeader(adminToken))
        .send(adminBook);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject({
        title: adminBook.title,
        author: adminBook.author,
        genre: adminBook.genre,
        publication_date: expect.stringContaining(
          new Date(adminBook.publication_date).toISOString().split('T')[0]
        ),
      });

      adminBookId = response.body.data.id;
    });

    test('should allow admin to update a book', async () => {
      const updatedTitle = 'Updated ' + adminBook.title;

      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .patch(`/items/books/${adminBookId}`)
        .set(getAuthHeader(adminToken))
        .send({ title: updatedTitle });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updatedTitle);
    });
  });

    /**
   * Authenticated user access rules for Books
   * @description Verifies that users can create and read books,
   * and can only update or delete records they own.
  */
  describe('User Access', () => {
    test('user can create a book', async () => {
      const book = createTestBook();

      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/items/books')
        .set(getAuthHeader(userToken))
        .send(book);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(book.title);
      expect(response.body.data.user_created).toBeDefined();

      userBookId = response.body.data.id;
    });

    test('user can read books', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .get('/items/books')
        .set(getAuthHeader(userToken));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    test('user can update own book', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .patch(`/items/books/${userBookId}`)
        .set(getAuthHeader(userToken))
        .send({ title: 'User Updated Book' });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('User Updated Book');
    });

    test('user cannot update another user’s book', async () => {
      const book = createTestBook();

      const createResponse = await request(TEST_CONFIG.DIRECTUS_URL)
        .post('/items/books')
        .set(getAuthHeader(otherUserToken))
        .send(book);

      otherUserBookId = createResponse.body.data.id;

      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .patch(`/items/books/${otherUserBookId}`)
        .set(getAuthHeader(userToken))
        .send({ title: 'Illegal Update' });

      expect(response.status).toBe(403);
    });

    test('user cannot delete another user’s book', async () => {
      const response = await request(TEST_CONFIG.DIRECTUS_URL)
        .delete(`/items/books/${otherUserBookId}`)
        .set(getAuthHeader(userToken));

      expect(response.status).toBe(403);
    });
  });
  
});
