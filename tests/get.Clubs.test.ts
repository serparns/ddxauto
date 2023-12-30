import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { json } from "stream/consumers";
import { getBaseFalseParameters, getBaseParameters } from "../entities/baseParameters";

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
})