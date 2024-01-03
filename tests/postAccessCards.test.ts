import {expect, test} from "@playwright/test";
import {getBaseParameters} from "../entities/baseParameters";
import api from '../api.json';
import {log} from "../utils/logger";
import {getRandomCardNumber} from "../utils/random";
import {dataAccessCard, dataParans} from "../entities/dataAccessCard";

const type = ['bracelet', 'disposable_card'];

test.describe("Api-тесты на создание карт доступа", async () => {
    // type.forEach(type => {
        test(`[positive] Создание карты доступа ${type}`, async ({request}) => {
            const url = `${api.urls.base_url_api}${api.paths.access_cards}`;
            const requestBody = {...await dataParans(), ...await dataAccessCard()}
            log("request url", url);
            log("requestBody", requestBody);
            const response = await request.post(
                url,
                {
                    headers: {
                        'Authorization': `${api.token.test}`
                    },
                    data: requestBody
                }
            );
            log("request status", response.status());
            log("response body", JSON.stringify(await response.json(), null, '\t'));
            expect(response.status()).toEqual(200);
        });
    // })
})