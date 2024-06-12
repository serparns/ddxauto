import userTestData from "@data/user.json";
import { getBaseParameters } from "@entities/baseParameters";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { SportExperience } from "@libs/sportExperience";
import { Statuses } from "@libs/statuses";
import UsersRequests from "@requests/users.requests";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Api-тест на создание юзера с клубом и получения данных о нем", async () => {
    test("[positive] получить юзера с подстановкой id клуба из запроса", async ({ request, clubId }) => {
        const createUser = await test.step("Получить id клиента", async () => {
            const requestBody = await getUserRequestJson(clubId,
                getRandomEmail(),
                getRandomPhoneNumber(),
                SportExperience.FIVE_YEARS,
                userTestData.password);
            const createUser = await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)
            return createUser.json()
        });

        const getUser = await test.step("Получить информацию о пользователе", async () => {
            const response = await new UsersRequests(request).getUser(Statuses.OK, await getBaseParameters(), createUser.data.id)
            return response.json()
        })

        await test.step("Проверки", async () => {
            expect(getUser.data.id).toEqual(createUser.data.id);
            expect(getUser.data.home_club_id).toEqual(clubId);
            expect(getUser.data.phone).toEqual(createUser.data.phone);
            expect(getUser.data.email).toEqual(createUser.data.email);
        })
    });
})
