import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";
import {getUserRequestJson} from "@entities/user.requestJson";
import {getUserSearchRequestJson} from "@entities/userSearch.requestJson";


test.describe("Api-тесты на поиск пользователя по параметрам", async () => {
    let userData: any;
    let clubId: number;

    const userSearchResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            phone?: string,
            name?: string,
            lastName?: string,
            email?: string,
            birthday?: string
        }) => {
        const requestBody = await getUserSearchRequestJson(
            parameters.name,
            parameters.email,
            parameters.phone,
            parameters.lastName,
            parameters.birthday);
        return await new UsersRequests(request).postUsersSearch(status, requestBody);
    }

    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id;
        });

        userData = await test.step("создать пользователя и получить данные о нем", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    })

    test("[positive] Поиск пользователя по номеру телефона", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.OK, {phone: userData.phone}))).json()).data[0];

        await test.step("Проверки", async () => {
            expect(searchUser.id).toEqual(userData["id"]);
        })
    });

    test("[positive] Поиск пользователя по имени, фамилии и дате рождения", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.OK, {
                name: userData.name, lastName: userData.last_name,
                birthday: userData.birthday
            }))).json()).data[0];

        await test.step("Проверки", async () => {
            expect(searchUser.id).toEqual(userData["id"]);
        })
    });

    test("[positive] Поиск пользователя по имени, фамилии и емаил ", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.OK, {
                name: userData.name, lastName: userData.last_name,
                email: userData.email
            }))).json()).data[0];

        await test.step("Проверки", async () => {
            expect(searchUser.id).toEqual(userData["id"]);
        })
    });
})