import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {getBaseParameters} from "@entities/baseParameters";
import ClubsRequests from "@requests/clubs.requests";
import VerifyRequests from "@requests/verify.requests";
import {Statuses} from "@libs/statuses";
import requestTestData from "@data/request.json"
import {RequestSource} from "@libs/requestSource";
import {getUserRequestJson} from "@entities/user.requestJson";


test.describe("Api-тесты на получение кода верификации", async () => {
    test("[positive] отправка кода верификации клиенту", async ({request}) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const parameters = {...await getBaseParameters()};
            const getClubResponse = await new ClubsRequests(request).getClubById(Statuses.OK, parameters);
            const getClubData = await getClubResponse.json();
            return getClubData?.data[0]?.id;
        });

        const {userId, userPhone} = await test.step("Получить id клиента", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            const response = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return {
                userId: response.id,
                userPhone: response.phone
            }
        });

        const response = await test.step("Отправить код верификации клиенту", async () => {
            const requestBody = {
                session_id: requestTestData.session_id,
                request_id: requestTestData.request_id,
                request_source: RequestSource.CRM,
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