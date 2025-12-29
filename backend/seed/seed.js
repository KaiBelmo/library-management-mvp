import axios from 'axios';
import { faker } from '@faker-js/faker';
import FormData from 'form-data';
import 'dotenv/config';
import http from 'http';

const DIRECTUS_URL = process.env.DIRECTUS_URL;

const api = axios.create({ 
  baseURL: DIRECTUS_URL,
  timeout: 60000,
  httpAgent: new http.Agent({ keepAlive: false }), 
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function uploadUniqueImage(token) {
  try {
    const imageUrl = `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/400/600`;
    
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    const form = new FormData();
    form.append('file', Buffer.from(response.data), {
      filename: `cover-${faker.string.alphanumeric(8)}.jpg`,
      contentType: 'image/jpeg',
    });

    const uploadRes = await api.post('/files', form, {
      headers: { 
        Authorization: `Bearer ${token}`,
        ...form.getHeaders() 
      }
    });

    return uploadRes.data.data.id;
  } catch (error) {
    console.error('Image upload failed, skipping cover...');
    return null;
  }
}

async function runSeed() {
  const TOTAL_USERS = 20;
  
  try {
    console.log(`Starting Seed for ${TOTAL_USERS} users...`);

    for (let i = 1; i <= TOTAL_USERS; i++) {
      const userData = {
        email: faker.internet.email().toLowerCase(),
        password: 'Password123!',
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName()
      };

      await api.post('/users/register', userData);
      const loginRes = await api.post('/auth/login', {
        email: userData.email,
        password: userData.password
      });

      const token = loginRes.data.data.access_token;
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      const bookCount = faker.number.int({ min: 2, max: 4 });

      for (let b = 0; b < bookCount; b++) {
        const randomDate = faker.date.between({ 
            from: '2010-01-01T00:00:00.000Z', 
            to: new Date() 
        }).toISOString();

        const coverId = await uploadUniqueImage(token);
        const canHaveComments = faker.datatype.boolean(0.8);

        const bookRes = await api.post('/items/books', {
          title: faker.book.title(),
          author: faker.book.author(),
          genre: faker.book.genre(),
          publication_date: randomDate,
          cover_photo: coverId,
          allow_comments: canHaveComments
        }, authHeader);

        if (canHaveComments) {
          const commentCount = faker.number.int({ min: 1, max: 3 });
          for (let c = 0; c < commentCount; c++) {
            await api.post('/items/comments', {
              content: faker.lorem.sentence(),
              author_name: faker.person.fullName(),
              book_id: bookRes.data.data.id,
              date_created: faker.date.recent({ days: 30 }).toISOString() 
            }, authHeader);
          }
        }
        await sleep(1000); 
      }
      console.log(`[${i}/${TOTAL_USERS}] Seeded: ${userData.email}`);
    }

    console.log('\nSeeding Complete without warnings!');
  } catch (error) {
    if (error.response?.status === 429) {
        console.error('Rate limit hit. Update docker-compose.yml to set RATE_LIMITER_ENABLED: "false"');
    } else {
        console.error('Seed Failed:', error.response?.data || error.message);
    }
  }
}

runSeed();