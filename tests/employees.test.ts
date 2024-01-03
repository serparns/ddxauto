import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { getBaseParameters } from "../entities/baseParameters";
import {log} from "../utils/logger";

test.describe("Получение списка позиций", async () => {
    test("[positive] Получение списка позиций",async ({ request }) => {
        const url = `${api.urls.base_url_api}${api.paths.employees}`;
        const parameters = {...await getBaseParameters()}
        log("request url", url);
        log("parameters", parameters);
        const response = await request.get(
            url,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           params: parameters
        }
    );
        log("request status", response.status());
        log("response body", JSON.stringify(await response.json(), null, '\t'));
        expect(response.status()).toEqual(200);
    });
})