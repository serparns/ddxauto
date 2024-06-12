import { userVerifyBaseSchema, userVerifyDataSchema } from "@entities/JsonSchema/userVerify.response";
import { selectVerifyCode } from "@entities/db/userNotifications.db";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PostUserVerifyRequestJson, postVerifyGetCodeRequestJson } from "@entities/interface/verifyJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import UsersRequests from "@requests/users.requests";
import VerifyRequests from "@requests/verify.requests";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { validatorJson } from "@utils/validator";

test.describe("Тесты на верификацию пользователя", async () => {
    let userResponseData: any;
    let userVerifyCode: any;

    const postUserVerifyResponse = async (
        request: APIRequestContext,
        status: Statuses,
    ) => {
        const code = JSON.parse(JSON.stringify(userVerifyCode)).code
        const requestBody = await PostUserVerifyRequestJson(userResponseData.id, userResponseData.email, code);
        return await new VerifyRequests(request).postUserVerify(status, requestBody);
    };

    test.beforeAll(async ({ request, clubId }) => {
        userResponseData = await test.step("Получить данные пользователя", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });

        await test.step("Отправить запрос на получения кода верификации", async () => {
            const requestBody = await postVerifyGetCodeRequestJson(userResponseData.id, userResponseData.email);
            return await new VerifyRequests(request).postGetCode(Statuses.OK, requestBody);
        });

        userVerifyCode = await test.step("Получить код верификации", async () => {
            return (await selectVerifyCode(userResponseData.id))
        });
    });

    test("Верификация пользователя", async ({ request }) => {
        const userVerifyData = await (await test.step("Верификация пользователя",
            async () => postUserVerifyResponse(request, Statuses.OK))).json();

        await test.step("Проверки", async () => {
            expect(await userVerifyData.verification_token).not.toBeNull;
            expect(await userVerifyData.data.id).toEqual(userResponseData.id);
            expect(await userVerifyData.data.phone).toEqual(userResponseData.phone);
            expect(await userVerifyData.data.email).toEqual(userResponseData.email);
            expect(await userVerifyData.data.name).toEqual(userResponseData.name);
            await validatorJson(userVerifyDataSchema, (userVerifyData.data));
            await validatorJson(userVerifyBaseSchema, (userVerifyData));
        });
    });
});