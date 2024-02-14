import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";
import {getUserRequestJson} from "@entities/user.requestJson";
import {SportExperience} from "@libs/sportExperience";
import userTestData from "@data/user.json";
import {validatorJson} from "@utils/validator";
import {userDataJsonSchema} from "@entities/user.response";

test.describe("Api-тест на создание клиента", async () => {
    let clubId: number
    const userCrateResponse = async (
        request: APIRequestContext,
        status: Statuses,
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

    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        })
    });

    Object.values(SportExperience).forEach(sport_expirince => {
        test(`[positive] Создание пользователя с опытом ${sport_expirince} `, async ({request}) => {
            const userCreateSuccessResponse = await test.step("создание пользователя",
                async () => userCrateResponse(request, Statuses.OK, {
                    sportExperience: sport_expirince,
                    password: userTestData.password
                }));

            await test.step("Проверки", async () => {
                expect((await userCreateSuccessResponse.json()).data.home_club_id).toEqual(clubId)
                expect((await userCreateSuccessResponse.json()).data.sport_experience).toEqual(sport_expirince);
            });
        })
    })

    test("[positive] Создание пользователя", async ({request}) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.OK, {
                sportExperience: SportExperience.FIVE_YEARS,
                password: userTestData.password
            }));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).data.home_club_id).toEqual(clubId);
        });
    });

    test("[positive] Создание пользователя без sport_experience", async ({request}) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.OK, {password: userTestData.password}));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).data.sport_experience).toEqual("Не указан");
        });
    });

    test("[positive] Создание пользователя без пароля", async ({request}) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.OK));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).data.home_club_id).toEqual(clubId);
        });
        await test.step("Проверить схему ответа", async () => {
            await validatorJson(userDataJsonSchema, (await userCreateSuccessResponse.json()).data);
        });
    });

    test("[negative] Создание пользователя с невалидным sport_experience", async ({request}) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.BAD_REQUEST, {sportExperience: "Не скажу"}));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).error.code).toEqual("user_create_error");
            expect((await userCreateSuccessResponse.json()).error.message).toEqual("ERROR: invalid input value for enum sport_experience: \"Не скажу\" (SQLSTATE 22P02)");
        });
    });
})
