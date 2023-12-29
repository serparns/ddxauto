import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { json, text } from "stream/consumers";

test.describe("Api-тесты на получение PaymentPlans ", async () => {
    test("[positive] получить список PaymentPlans",async ({ request }) => {
        const response = await request.get(
         `${api.urls.base_url_api}${api.paths.payment_plans}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           params :{
            session_id: "345",
	        request_id: "345",
	        request_source: "crm",
            is_active : true
            }
        }
    );

    expect(response.status()).toEqual(200);
    console.log(await response.json())          
    });
})