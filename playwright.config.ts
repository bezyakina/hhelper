import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./src",
  timeout: 60 * 60 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: "html",
  use: {
    actionTimeout: 15000,
    navigationTimeout: 15000,
    screenshot: "only-on-failure",
    baseURL: "https://hh.ru",
  },
  reportSlowTests: undefined,
  retries: 2,
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};

export default config;
