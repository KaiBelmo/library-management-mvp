import type { Page } from '@playwright/test';

export const testUser = {
  id: 'user-123',
  email: 'archivist+test@example.org',
  first_name: 'Ada',
  last_name: 'Lovelace',
};

export async function mockRegisterFlow(page: Page) {
  // Register
  await page.route('**/users/register', route =>
    route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        data: { id: testUser.id, email: testUser.email },
      }),
    })
  );

  // Login (auto-login after register)
  await page.route('**/auth/login', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires: 3600,
        },
      }),
    })
  );

  // Fetch logged-in user
  await page.route('**/users/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: testUser }),
    })
  );

  // Optional profile update
  await page.route('**/users/*', route => {
    if (route.request().method() === 'PATCH') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: testUser }),
      });
    }
    route.continue();
  });
}

export async function mockLoginFlow(page: Page, fail = false) {
  await page.route('**/auth/login', route => {
    if (fail) {
      return route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [{ message: 'Invalid credentials' }],
        }),
      });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires: 3600,
        },
      }),
    });
  });

  await page.route('**/users/me', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: testUser }),
    })
  );
}
