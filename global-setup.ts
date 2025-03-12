//inside global setup we need to have a single function that will perform a certain operation for you
import { request , expect} from "@playwright/test";
import 'dotenv/config';
import user from "./.auth/user.json";
import fs from "fs";


const authFile = ".auth/user.json";
let userEmail = process.env["EMAIL"];
let password = process.env['PASSWORD'];

async function globalSetup() {

    console.log("************* executing global setup function *********************************");

    const context = await request.newContext();

    // get the token

    const response = await context.post("https://conduit-api.bondaracademy.com/api/users/login", {

        data: {
            "user": {
                "email": userEmail,
                "password": password
            }
        }

    });

    const responseBody = await response.json();

    const accessToken = responseBody?.user?.token;
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user));

    //store access token to env variable
    process.env["ACCESS_TOKEN"] = accessToken;



    const articleResponse = await context.post("https://conduit-api.bondaracademy.com/api/articles/", {
        data: {
            "article": {
                "title": "Global test article",
                "description": "global test article description",
                "body": "This is a test article",
                "tagList": [
                    "test"
                ]
            },
        },
        headers: {

            Authorization: `Token ${process.env["ACCESS_TOKEN"]}`

        }
    });

    expect(articleResponse.status()).toEqual(201);

    const resp = await articleResponse.json();
    const slugID = resp.article.slug;
    process.env["SLUGID"]=slugID;


}

export default globalSetup;
