import { test as setup, expect } from "@playwright/test";

setup("create a new article", async ({ request }) => {

    console.log("executing article create setup");

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
    });

    expect(articleResponse.status()).toEqual(201);

    const response = await articleResponse.json();

    const slugID = response.article.slug;

    process.env["SLUGID"]=slugID;

});

