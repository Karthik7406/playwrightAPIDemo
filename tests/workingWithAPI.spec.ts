import { test, expect, request } from '@playwright/test';

import tags from "../test-data/tags.json";
import 'dotenv/config'


let userEmail = process.env["EMAIL"]!;
let password = process.env["PASSWORD"]!;




test.beforeEach(async ({ page }) => {

  await page.route("**/*/tags", async route => {
    await route.fulfill({
      "body": JSON.stringify(tags)
    })
  })

  await page.goto("https://conduit.bondaracademy.com/");
  //authenticating the session

  await page.getByText("Sign in").click();
  await page.getByPlaceholder("Email").fill(userEmail);
  await page.getByPlaceholder("Password").fill(password);

  await page.getByRole("button", {name: "Sign in"}).click();
})


test('has title', async ({ page }) => {

  await page.route("*/**/api/articles*", async route => {

    const response = await route.fetch(); // complete API call and gets response
    const responseBody = await response.json()

    responseBody.articles[0].title = "This is the modified title";
    responseBody.articles[0].description = "This is the modified description";

    await route.fulfill({
      "body": JSON.stringify(responseBody)
    })


  })

  await page.getByText("Global Feed").click();

  await expect(page.locator(".navbar-brand")).toHaveText("conduit");
  await expect(page.locator("app-article-list h1").first()).toContainText("This is the modified title")
  await expect(page.locator("app-article-list p").first()).toContainText("This is the modified description")
});




test("delete article", async ({ page, request }) => {

  const response = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {

    data: {
      "user": {
        "email": userEmail,
        "password": password
      }
    }

  });

  const responseBody = await response.json();
  const accessToken = responseBody.user.token;

  console.log("response body ", accessToken);


  const articleResponse = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
    data: {
      "article": {
        "title": "test article",
        "description": "test article description",
        "body": "This is a test article",
        "tagList": [
          "test"
        ]
      },
    },
    headers: {
      Authorization: `Token ${accessToken}`
    }
  })
  console.log("article value ", await articleResponse.json())
  expect(articleResponse.status()).toEqual(201);

  await page.getByText("Global Feed").click();
  await page.getByText("test article").first().click();
  await page.getByRole("button", {name: " Delete Article "}).first().click()
  await page.getByText("Global Feed").click();

  //check first article doesnot contain the created test article
  await expect(page.locator("app-article-list h1").first()).not.toContainText("test article")


  

})















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