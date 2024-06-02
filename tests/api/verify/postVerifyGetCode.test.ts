import { getBaseParameters } from "@entities/baseParameters";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { postVerifyGetCodeRequestJson } from "@entities/interface/verifyJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import UsersRequests from "@requests/users.requests";
import VerifyRequests from "@requests/verify.requests";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Тесты на отправку кода для верификации", async () => {
    let clubId: number;
    let userResponseData: any;

    const postVerifyGetCodeResponse = async (
        request: APIRequestContext,
        status: Statuses,
    ) => {
        const requestBody = await postVerifyGetCodeRequestJson(userResponseData.id, userResponseData.email);
        return await new VerifyRequests(request).postGetCode(status, requestBody);
    };

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });

        userResponseData = await test.step("Получить данные пользователя", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    });

    test("Отправка кода верификации", async ({ request }) => {
        await test.step("Запрос на отправку кода верификации клиенту",
            async () => postVerifyGetCodeResponse(request, Statuses.OK));
    });
});