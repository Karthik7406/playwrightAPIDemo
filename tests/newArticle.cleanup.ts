import { test as setup, expect } from "@playwright/test";


setup("delete article", async({request}) => {

    console.log("executing article cleanup setup");
    let deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env["SLUGID"]}`);
});


