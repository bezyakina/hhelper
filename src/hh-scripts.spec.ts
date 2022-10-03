import { expect, Page, test } from "@playwright/test";

const waitUntil = "domcontentloaded";

const emailField = '[data-qa="login-input-username"]';
const loginByPasswordButton = '[data-qa="expand-login-by-password"]';
const loginSubmitButton = '[data-qa="account-login-submit"]';
const passwordField = '[data-qa="login-input-password"]';
const relocationWarningConfirmButton = '[data-qa="relocation-warning-confirm"]';
const resumeUpdateButton = '[data-qa="resume-update-button"]';
const resumeUpdateMessage = '[data-qa="resume-update-message"]';
const vacancyResponseButtons = '[data-qa="vacancy-serp__vacancy_response"]';
const vacancyResponseLetterField =
  '[data-qa="vacancy-response-popup-form-letter-input"]';
const vacancyResponseLetterToggle =
  '[data-qa="vacancy-response-letter-toggle"]';
const vacancyResponseSubmitButton = '[data-qa="vacancy-response-submit-popup"]';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await login(page);
});

test("Update each resume from list on hh.ru", async () => {
  const resumeIds = process.env.RESUME_IDS?.split(",") ?? "";
  for (let resumeId of resumeIds) {
    await updateResume(page, resumeId);
  }
});

test("Apply for all vacancies from job filter", async () => {
  await applyForVacanciesFromFilter(page);
});

/**
 * Logs user on hh.ru account with email and password
 * @param page - see https://playwright.dev/docs/api/class-page
 */
async function login(page: Page) {
  await page.goto("/account/login", {
    waitUntil,
  });
  await page.click(loginByPasswordButton);
  await page.locator(emailField).fill(process.env.EMAIL ?? "");
  await page.locator(passwordField).fill(process.env.PASSWORD ?? "");
  await page.click(loginSubmitButton);
  await page.waitForNavigation({
    url: "/?hhtmFrom=account_login",
    waitUntil,
  });
}

/**
 * Updating resume by id from url and checking if update message appear
 *
 * @param page - see https://playwright.dev/docs/api/class-page
 * @param resumeId - resume id from url
 */
async function updateResume(page: Page, resumeId: string) {
  await page.goto(`/resume/${resumeId}`);
  await page.locator(resumeUpdateButton).last().click();

  expect.soft(page.locator(resumeUpdateMessage)).toBeDefined();
}

/**
 * Applying for all vacancies from job filter with cover letter
 *
 * @param page - see https://playwright.dev/docs/api/class-page
 */
async function applyForVacanciesFromFilter(page: Page) {
  await page.goto(`/search/vacancy?${process.env.JOB_FILTER}`, {
    waitUntil,
  });

  const vacancies = await page.locator(vacancyResponseButtons);
  const vacanciesCount = await vacancies.count();

  for (let i = 0; i < vacanciesCount; i++) {
    try {
      await vacancies.nth(i).click();
      try {
        await page.locator(relocationWarningConfirmButton).click();
      } catch {}
      await page.locator(vacancyResponseLetterToggle).click();
      await page
        .locator(vacancyResponseLetterField)
        .fill(process.env.LETTER ?? "");
      await page.locator(vacancyResponseSubmitButton).click();
    } catch {}
  }
}
