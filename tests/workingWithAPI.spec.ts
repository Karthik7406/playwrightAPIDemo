import { test, expect, Page } from '@playwright/test';

import tags from "../test-data/tags.json";

test.beforeEach(async ({ page }) => {

  await page.route("**/*/tags", async route => {
    await route.fulfill({
      "body": JSON.stringify(tags)
    })
  })


  await page.route("*/**/api/articles*", async route => {

    const response = await route.fetch(); // complete API call and gets response
    const responseBody = await response.json()

    responseBody.articles[0].title = "This is the modified title";
    responseBody.articles[0].description = "This is the modified description";

    await route.fulfill({
      "body": JSON.stringify(responseBody)
    })


  })

  await page.goto("https://conduit.bondaracademy.com/");
})


test('has title', async ({ page }) => {
  //await page.waitForTimeout(500);
  await expect(page.locator(".navbar-brand")).toHaveText("conduit");

  await expect(page.locator("app-article-list h1").first()).toContainText("This is the modified title")
  await expect(page.locator("app-article-list p").first()).toContainText("This is the modified description")
});

















// test.beforeEach(async ({ browser }) => {
//   const context = await browser.newContext({
//     serviceWorkers: 'block' // Prevent Service Worker interference
//   });

//   // Use browserContext.route() to intercept requests across all pages
//   await context.route('**/api/tags', async route => {
//     await route.fulfill({
//       status: 200,
//       contentType: 'application/json',
//       body: JSON.stringify(tags)
//     });
//   });

//   // Store the page in the test context so that the test function can use it
//   test.info().annotations.push({ type: 'page', description: 'context page' });
// });