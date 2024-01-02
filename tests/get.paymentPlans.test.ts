import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { getBaseParameters } from "../entities/baseParameters";

test.describe("Api-тесты на получение PaymentPlans ", async () => {
    test("[positive] получить список PaymentPlans",async ({ request }) => {
        const response = await request.get(
         `${api.urls.base_url_api}${api.paths.payment_plans}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           params :{...await getBaseParameters(), ...{is_active : true}}
        }
    );
    expect(response.status()).toEqual(200);
    });
})