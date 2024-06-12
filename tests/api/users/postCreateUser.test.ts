import userTestData from "@data/user.json";
import { baseDataJsonSchema } from "@entities/JsonSchema/base.response";
import { errorDataJsonSchema } from "@entities/JsonSchema/error.response";
import { userDataJsonSchema } from "@entities/JsonSchema/user.response";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { SportExperience } from "@libs/sportExperience";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import UsersRequests from "@requests/users.requests";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { validatorJson } from "@utils/validator";

test.describe("Api-тест на создание клиента", async () => {
    let clubId: number
    const userCrateResponse = async (
        request: APIRequestContext,
        status: Statuses,
        clubId: number,
        parameters?: {
            sportExperience?: string
            password?: string
        }) => {
        const requestBody = await getUserRequestJson(clubId,
            getRandomEmail(),
            getRandomPhoneNumber(),
            parameters?.sportExperience,
            parameters?.password);
        return await new UsersRequests(request).postCreateUser(status, requestBody);
    }

    async function validator(userCreateSuccessResponse: any): Promise<void> {
        expect(await validatorJson(baseDataJsonSchema, (await userCreateSuccessResponse.json())));
        expect(await validatorJson(userDataJsonSchema, (await userCreateSuccessResponse.json()).data));
    }

    Object.values(SportExperience).forEach(sport_experience => {
        test(`[positive] Создание пользователя с опытом ${sport_experience} `, async ({ request, clubId }) => {
            const userCreateSuccessResponse = await test.step("создание пользователя",
                async () => userCrateResponse(request, Statuses.OK, clubId, {
                    sportExperience: sport_experience,
                    password: userTestData.password
                }));

            await test.step("Проверки", async () => {
                expect((await userCreateSuccessResponse.json()).data.home_club_id).toEqual(clubId)
                expect((await userCreateSuccessResponse.json()).data.sport_experience).toEqual(sport_experience);
            });
            await test.step("Проверить схему ответа", async () => validator(userCreateSuccessResponse));
        })
    })

    test("[positive] Создание пользователя", async ({ request, clubId }) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.OK, clubId, {
                sportExperience: SportExperience.FIVE_YEARS,
                password: userTestData.password
            }));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).data.home_club_id).toEqual(clubId);
        });

        await test.step("Проверить схему ответа", async () => validator(userCreateSuccessResponse));
    });

    test("[positive] Создание пользователя без sport_experience", async ({ request, clubId }) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.OK, clubId, { password: userTestData.password }));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).data.sport_experience).toEqual("Не указан");
        });

        await test.step("Проверить схему ответа", async () => validator(userCreateSuccessResponse));
    });

    test("[positive] Создание пользователя без пароля", async ({ request, clubId }) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.OK, clubId));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).data.home_club_id).toEqual(clubId);
        });

        await test.step("Проверить схему ответа", async () => validator(userCreateSuccessResponse));
    });

    test("[negative] Создание пользователя с невалидным sport_experience", async ({ request }) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.BAD_REQUEST, clubId, { sportExperience: "Не скажу" }));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).error.code).toEqual("user_create_error");
            expect((await userCreateSuccessResponse.json()).error.message).toEqual("ERROR: invalid input value for enum sport_experience: \"Не скажу\" (SQLSTATE 22P02)");
        });

        await test.step("Проверить схему ответа", async () => {
            await validatorJson(errorDataJsonSchema, (await userCreateSuccessResponse.json()).error);
            await validatorJson(baseDataJsonSchema, (await userCreateSuccessResponse.json()));
        });
    });
});