import { expect, test } from "@playwright/test";
import api from "@api"
import { getBaseParameters } from "@entities/baseParameters";
import { Statuses } from "@libs/statuses";

test.describe("Api-тесты на получение PaymentPlans ", async () => {
    test("[positive] получить список PaymentPlans", async ({ request }) => {
        const response = await request.get(
            `${api.urls.base_url_api}${api.paths.payment_plans}`,
            {
                headers: {
                    'Authorization': `${api.tokens.test}`
                },
                params: { ...await getBaseParameters(), ...{ is_active: true } }
            }
        );
        expect(response.status()).toEqual(Statuses.OK);
    });
})