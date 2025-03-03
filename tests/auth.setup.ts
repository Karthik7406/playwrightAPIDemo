import {test as setup } from '@playwright/test';
import 'dotenv/config'

let userEmail = process.env["EMAIL"]!;
let password = process.env["PASSWORD"]!;


const authFile = ".auth/user.json";

setup("authentication", async({page}) => {
    await page.goto("https://conduit.bondaracademy.com/");

  await page.getByText("Sign in").click();
  await page.getByPlaceholder("Email").fill(userEmail);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", {name: "Sign in"}).click();

  await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");

  await page.context().storageState({path: authFile});

})