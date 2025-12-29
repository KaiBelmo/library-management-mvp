import { test, expect } from '@playwright/test'
import { mockRegisterFlow, mockLoginFlow, testUser } from './test-utils'

/**
 * Robust helper to handle framework re-renders.
 */
async function ensureFilled(
  locator: ReturnType<import('@playwright/test').Page['locator']>,
  value: string
) {
  await locator.waitFor({ state: 'visible' });
  await locator.click();
  await locator.fill('');
  await locator.pressSequentially(value, { delay: 50 });
  await locator.blur();
}

test.describe('Auth flows (Directus)', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login'); // or your base URL
    await page.waitForLoadState('networkidle');
  });

  test('Register flow redirects to home', async ({ page }) => {
    await mockRegisterFlow(page)
    await page.goto('/register')
    await page.waitForLoadState('networkidle');

    const firstName = page.getByPlaceholder('John')
    const lastName = page.getByPlaceholder('Doe')
    const email = page.getByPlaceholder('archivist@library.org')
    const password = page.getByPlaceholder('••••••••')
    const submit = page.getByRole('button', { name: /submit request/i })

    // Fill sequence
    await ensureFilled(firstName, testUser.first_name)
    await ensureFilled(lastName, testUser.last_name)
    await ensureFilled(email, testUser.email)
    await ensureFilled(password, 'password123')

    if ((await email.inputValue()) === "") {
        await email.fill(testUser.email);
    }

    await expect(submit).toBeEnabled()
    await submit.click()
    await expect(page).toHaveURL(/\/$/, { timeout: 10_000 })
  })

  test('Login redirects to home', async ({ page }) => {
    await mockLoginFlow(page)
    await page.goto('/login')
    await page.waitForLoadState('networkidle');

    const email = page.getByPlaceholder('archivist@library.org')
    const password = page.getByPlaceholder('••••••••')
    const submit = page.getByRole('button', { name: /authorize access/i })

    await ensureFilled(email, testUser.email)
    await ensureFilled(password, 'password123')

    await expect(submit).toBeEnabled()
    
    await submit.click()
    await expect(page).toHaveURL(/\/$/, { timeout: 10_000 })
  })

  test('Login error keeps user on login page', async ({ page }) => {
    await mockLoginFlow(page, true)
    await page.goto('/login')
    await page.waitForLoadState('networkidle');

    const email = page.getByPlaceholder('archivist@library.org')
    const password = page.getByPlaceholder('••••••••')
    const submit = page.getByRole('button', { name: /authorize access/i })

    await ensureFilled(email, testUser.email)
    await ensureFilled(password, 'wrong-password')

    await submit.click()

    await expect(page).toHaveURL(/\/login/)
    await expect(submit).toBeEnabled()
  })
})