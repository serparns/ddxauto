import {expect, test} from "@playwright/test";
import api from "@api"
import {getBaseParameters} from "@entities/baseParameters";
import {log} from "@utils/logger";
import {Statuses} from "@libs/statuses";

const club_id = ['3', '5', '1000'];

test.describe("Получение списка позиций", async () => {
    club_id.forEach(club_id => {
        test(`[positive] Получение списка позиций по клубу ${club_id}`, async ({request}) => {
            const url = `${api.urls.base_url_api}${api.paths.employees}`;
            const parameters = {...await getBaseParameters(), club_id}
            log("request url", url);
            log("parameters", parameters);
            const response = await request.get(
                url,
                {
                    headers: {
                        'Authorization': `${api.tokens.test}`
                    },
                    params: parameters
                }
            );
            log("request status", response.status());
            log("response body", JSON.stringify(await response.json(), null, '\t'));
            expect(response.status()).toEqual(Statuses.OK);
        });
    })
})