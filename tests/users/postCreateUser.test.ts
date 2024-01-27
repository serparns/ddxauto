import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import {RequestSource} from "@libs/requestSource";
import {SportExperience} from "@libs/sportExperience";
import userTestData from "@data/user.json"
import requestTestData from "@data/request.json"
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";

test.describe("Api-тест на создание клиента", async () => {
    let clubId: number

    const userCrateResponse = async (request: APIRequestContext, status: Statuses) => {
        const requestBody = {
            session_id: requestTestData.session_id,
            request_id: requestTestData.request_id,
            request_source: RequestSource.CRM,
            data: {
                email: getRandomEmail(),
                name: getRandomName(),
                last_name: userTestData.last_name,
                middle_name: userTestData.middle_name,
                sex: userTestData.sex.male,
                phone: getRandomPhoneNumber(),
                birthday: userTestData.birthday,
                password: userTestData.password,
                lang: userTestData.lang,
                sport_experience: SportExperience.FIVE_YEARS,
                home_club_id: clubId
            }
        }
        return await new UsersRequests(request).postCreateUser(status, requestBody);
    }

    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        })
    });

    test("[positive] Создание пользователя", async ({request}) => {
        const userCreateSuccessResponse = await test.step("создание пользователя",
            async () => userCrateResponse(request, Statuses.OK));

        await test.step("Проверки", async () => {
            expect((await userCreateSuccessResponse.json()).data.home_club_id).toEqual(clubId);
        })
    })
});