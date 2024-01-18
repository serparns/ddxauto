import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {getBaseParameters} from "@entities/baseParameters";
import ClubsRequests from "@requests/clubs.requests";
import VerifyRequests from "@requests/verify.requests";
import {Statuses} from "@libs/statuses";


test.describe("Api-тесты на получение кода верификации", async () => {
    test("[positive] отправка кода верификации клиенту", async ({request}) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = {...await getBaseParameters()};
            const getClubResponse = await new ClubsRequests(request).getClubById(Statuses.OK, parameters);
            const getClubData = await getClubResponse.json();
            return getClubData?.data[0]?.id;
        });

        const {userId, userPhone} = await test.step("Получить id клиента", async () => {
            const requestBody = {
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
                    club_access: true,
                    admin_panel_access: true,
                    group_training_registration_access: true,
                    sport_experience: "Нет опыта",
                    home_club_id: clubId
                }
            }
            const response = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return {
                userId: response.id,
                userPhone: response.phone
            }
        });

        const response = await test.step("Отправить код верификации клиенту", async () => {
            const requestBody = {
                session_id: "123",
                request_id: "321",
                request_source: "crm",
                data: {
                    message_type: "sms",
                    contact: userPhone,
                    template: "mail_signing_an_agreement",
                    user_id: userId
                }
            }

            const response = await new VerifyRequests(request).postGetCode(Statuses.OK, requestBody);
            return response.json()
        });
        await test.step("EXPECT", async () => {
            expect(response.status).toEqual('OK');


        })


    });
});