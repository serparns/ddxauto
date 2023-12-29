import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { json } from "stream/consumers";

test.describe("Api-тесты на получение списка клубов", async () => {
    test("[positive] получить список клубов",async ({ request }) => {
        const response = await request.get(
         `${api.urls.base_url_api}${api.paths.clubs}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           params :{
            session_id: "345",
	        request_id: "345",
	        "request_source": "crm",
            }
        }
    );

    expect(response.status()).toEqual(200);
        
    });
    test("[negative] получить список клубов, убрать один из обязательных параметров",async ({ request }) => {
        const response = await request.get(
         `${api.urls.base_url_api}${api.paths.clubs}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           params :{
	        request_id: 3434,
	        "request_source": "crm",
            }
        }
    );
    expect(response.status()).toEqual(400)
    const text = await response.text();
    expect(text).toContain('API session_id required')        
    });    
})