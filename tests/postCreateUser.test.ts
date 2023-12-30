import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { json, text } from "stream/consumers";
import { getBaseParameters } from "../entities/baseParameters";
import { getRandomPhoneNumber } from "../utils/random";

test.describe("Api-тест на создание клиента", async () => {
    test("[positive] Создать нового клиента ",async ({ request }) => {
        const response = await request.post(
         `${api.urls.base_url_api}${api.paths.users}`,
         {
           headers: {
            'Authorization': `${api.token.UltraToken}`
            }, 
           data: {
                session_id: "123",
                request_id: "321",
                request_source: "crm",
                data: {
                    email: "ttt@test.test",
                    name: "Имя",
                    last_name: "last_name",
                    middle_name: "string",
                    sex: "male",
                    phone: getRandomPhoneNumber(),
                    birthday: "1999-11-11",
                    password: "qwerty123",
                    lang: "ru",
                    home_club_id: 1,
                    club_access: true,
                    admin_panel_access: true,
                    group_training_registration_access: true,
                    sport_experience: "Больше 5 лет"
                }
        
            }
         }    
    );

    expect(response.status()).toEqual(200);       
    });
})