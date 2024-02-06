import {expect, test} from "@playwright/test";
import api from "@api"
import {Statuses} from "@libs/statuses";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";


test.describe("Api-тесты на создание заметки ", async () => {
    test("[positive] создать заметку", async ({request}) => {
        const response = await request.post(
            `${api.urls.base_url_api}${api.paths.notes}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                data:
                    {
                        session_id: requestTestData.session_id,
                        request_id: requestTestData.request_id,
                        request_source: RequestSource.CRM,
                        data: [
                            {
                                text: "тест пулл",
                                employee_id: 4486,
                                user_id: 1386172,
                                type: "block"
                            }
                        ]
                    }
            }
        );
        expect(response.status()).toEqual(Statuses.OK);
    });
})