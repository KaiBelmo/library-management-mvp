const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

jest.setTimeout(30000);

module.exports = {
  TEST_CONFIG: {
    DIRECTUS_URL: process.env.DIRECTUS_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  }
};
