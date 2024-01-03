import { expect, test }  from "@playwright/test";
import api from '../api.json';
import { getRandomEmail, getRandomPhoneNumber, randomSport_experience } from "../utils/random";
import {log} from "../utils/logger";

const sportExperiense = ['Нет опыта', '0-6 месяцев', 'Больше 5 лет', '2-3 года', '1-2 года', '3-5 лет']

test.describe("Api-тест на создание клиента", async () => {
    test("[positive] Создать нового клиента", async ({ request }) => {
        const response = await request.post(
         `${api.urls.base_url_api}${api.paths.users}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           data: {
                session_id: "123",
                request_id: "321",
                request_source: "crm",
                data: {
                    email: getRandomEmail(),
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

    test("[positive] Доп тест рандомный выбор Sport_experience", async ({ request }) => {
        const response = await request.post(
         `${api.urls.base_url_api}${api.paths.users}`,
         {
           headers: {
            'Authorization': `${api.token.test}`
            }, 
           data: {
                session_id: "123",
                request_id: "321",
                request_source: "crm",
                data: {
                    email: getRandomEmail(),
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
                    sport_experience: randomSport_experience()
                }
        
            }
         }    
    );
        expect(response.status()).toEqual(200);
    });

    test("[negative] Тест с невалиднвм значение sport_experience", async ({ request }) => {
        const response = await request.post(
            `${api.urls.base_url_api}${api.paths.users}`,
            {
                headers: {
                    'Authorization': `${api.token.test}`
                },
                data: {
                    session_id: "123",
                    request_id: "321",
                    request_source: "crm",
                    data: {
                        email: getRandomEmail(),
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
                        sport_experience: " Не скажу "
                    }

                }
            }
        );
        expect(response.status()).toEqual(400)
        const text = await response.text()
        expect(text).toContain('"error":{"code":"user_create_error","message":' +
            '"ERROR: invalid input value for enum sport_experience: \\" Не скажу \\" (SQLSTATE 22P02)"}')
    });

    sportExperiense.forEach(experiense => {
        test(`[positive] Создать клиента без пароля с опытом ${experiense} `, async ({ request }) => {
        const response = await request.post(
            `${api.urls.base_url_api}${api.paths.users}`,
            {
                headers: {
                    'Authorization': `${api.token.test}`
                },
                data: {
                    session_id: "123",
                    request_id: "321",
                    request_source: "crm",
                    data: {
                        email: getRandomEmail(),
                        name: "Имя",
                        last_name: "last_name",
                        middle_name: "string",
                        sex: "male",
                        phone: getRandomPhoneNumber(),
                        birthday: "1999-11-11",
                        lang: "ru",
                        home_club_id: 1,
                        club_access: true,
                        admin_panel_access: true,
                        group_training_registration_access: true,
                        sport_experience: experiense
                        }

                    }
                }
            );
            log("request status", response.status());
            log("response body", JSON.stringify(await response.json(), null, '\t'));
            expect(response.status()).toEqual(200)
        });
    })
})