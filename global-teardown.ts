import {request, expect} from "@playwright/test";


async function globalTeardown() {

    console.log("********** executing global teardown method *************");
    console.log("********** executing global teardown method *************");

    const context = await request.newContext();

    let deleteResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env["SLUGID"]}`, {
        headers: {
            Authorization: `Token ${process.env["ACCESS_TOKEN"]}`
        }
    });

    expect(deleteResponse.status()).toEqual(204);

}

export default globalTeardown;