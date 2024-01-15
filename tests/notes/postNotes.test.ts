import {expect, test} from "@playwright/test";
import api from '../../api.json';
import {Statuses} from "@libs/statuses";

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
                        session_id: "123",
                        request_id: "321",
                        request_source: "crm",
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