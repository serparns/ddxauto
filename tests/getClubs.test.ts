import {expect, test} from "@playwright/test";
import api from '../api.json';
import {getBaseFalseParameters, getBaseParameters} from "../entities/baseParameters";
import {log} from "../utils/logger";

const clubs = ['/4', '/5']

test.describe("Api-тесты на получение списка клубов", async () => {
    test("[positive] получить список клубов",async ({ request }) => {
        const response = await request.get(
         `${api.urls.base_url_api}${api.paths.clubs}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            },
           params : {...await getBaseParameters()}
        }
    );
        expect(response.status()).toEqual(200);
    });
    test("[negative] получить список клубов, убрать один из обязательных параметров", async ({ request }) => {
        const response = await request.get(
         `${api.urls.base_url_api}${api.paths.clubs}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            },
           params :{...await getBaseFalseParameters()}
        }
    );
        expect(response.status()).toEqual(400)
        const text = await response.text();
        expect(text).toContain('API session_id required')
    });

    clubs.forEach(clubs => {
        test(`[positive] получить информация по клубу ${clubs}`, async ({ request }) => {
            const url = `${api.urls.base_url_api}${api.paths.clubs}`+clubs;
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
})