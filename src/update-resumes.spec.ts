import { Page, test } from "@playwright/test";

test("Update each resume from list on hh.ru", async ({ page }) => {
  await login(page);

  const resumeIds = process.env.RESUME_IDS?.split(",") ?? "";
  for (let resumeId of resumeIds) {
    await updateResume(page, resumeId);
  }
});

/**
 * Login on hh.ru with email and password
 * @param page - see https://playwright.dev/docs/api/class-page
 */
async function login(page: Page) {
  await page.goto("https://hh.ru/account/login");
  await page.click('[data-qa="expand-login-by-password"]');
  await page
    .locator('[data-qa="login-input-username"]')
    .fill(process.env.EMAIL ?? "");
  await page
    .locator('[data-qa="login-input-password"]')
    .fill(process.env.PASSWORD ?? "");
  await page.click('[data-qa="account-login-submit"]');
  await page.waitForNavigation({
    timeout: 30000,
    url: "https://hh.ru/?hhtmFrom=account_login",
  });
}

/**
 * Update resume by id from url
 *
 * @param page - see https://playwright.dev/docs/api/class-page
 * @param resumeId - resume id from url
 */
async function updateResume(page: Page, resumeId: string) {
  await page.goto(`https://hh.ru/resume/${resumeId}`);
  await page.locator('[data-qa="resume-update-button"]').last().click();
}
