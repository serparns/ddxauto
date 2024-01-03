import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { getBaseParameters } from "../entities/baseParameters";

test.describe("Получение списка позиций", async () => {
    test("[positive] Получение списка позиций",async ({ request }) => {
        const response = await request.get(
         `${api.urls.base_url_api}${api.paths.employees}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           params :{...await getBaseParameters()}
        }
    );
        expect(response.status()).toEqual(200);
    });
})