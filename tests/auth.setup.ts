import {test as setup } from '@playwright/test';
import 'dotenv/config'

import user from "../.auth/user.json";
import fs from "fs";

let userEmail = process.env["EMAIL"]!;
let password = process.env["PASSWORD"]!;


const authFile = ".auth/user.json";

setup("authentication", async({request}) => {

  // await page.goto("https://conduit.bondaracademy.com/");

  // await page.getByText("Sign in").click();
  // await page.getByPlaceholder("Email").fill(userEmail);
  // await page.getByPlaceholder("Password").fill(password);
  // await page.getByRole("button", {name: "Sign in"}).click();

  // await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");

  // await page.context().storageState({path: authFile});

  const response = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {

    data: {
      "user": {
        "email": userEmail,
        "password": password
      }
    }

  });

  const responseBody = await response.json();

  const accessToken = responseBody?.user?.token;
  console.log("user data ", user);

  user.origins[0].localStorage[0].value = accessToken
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env["ACCESS_TOKEN"] = accessToken;

  console.log("response ", responseBody, process.env.ACCESS_TOKEN);


})