import { getBaseParameters } from "@entities/baseParameters";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { getUserSearchRequestJson } from "@entities/interface/userSearch.requestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import UsersRequests from "@requests/users.requests";
import { getDate, getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Api-тесты на поиск пользователя по параметрам", async () => {
    let userData: any
    let clubId: number;

    const userSearchResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            phone?: string | any,
            name?: string | any,
            lastName?: string,
            email?: string,
            birthday?: string | any
        }) => {
        const requestBody = await getUserSearchRequestJson(
            parameters.name,
            parameters.email,
            parameters.phone,
            parameters.lastName,
            parameters.birthday);
        return await new UsersRequests(request).postUsersSearch(status, requestBody);
    }

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        userData = await test.step("создать пользователя и получить данные о нем", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());

            return userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    })

    test("[negative] поиск пользователя по номеру телефона", async ({ request }) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.NOT_FOUND, { phone: "111111111" }))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.code).toEqual('data_find_error');
            expect(searchUser.message).toEqual('user not found');
        })
    });

    test("[negative] Поиск пользователя по имени, фамилии и дате рождения", async ({ request }) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.NOT_FOUND, {
                birthday: getDate(1),
                name: userData.name,
                lastName: userData.last_name
            }))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.code).toEqual('data_find_error');
            expect(searchUser.message).toEqual('user not found');
        })
    });

    test("[negative] Поиск пользователя по имени, фамилии и емаил ", async ({ request }) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.NOT_FOUND, {
                name: userData.name,
                lastName: userData.last_name,
                email: userData.name
            }))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.code).toEqual('data_find_error');
            expect(searchUser.message).toEqual('user not found');
        })
    });

    test("[negative] Поиск пользователя по номеру телефона: array", async ({ request }) => {
        const searchUser = (await (await test.step("поиск пользователя по номеру телефона: array",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, { phone: { userData: "phone" } }))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.message).toEqual('json: cannot unmarshal object into Go struct field requestData.data.phone of type string');
            expect(searchUser.code).toEqual('bind_error');
        })
    });

    test("[negative] Поиск пользователя по имени, фамилии и дате рождения: int", async ({ request }) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, { birthday: clubId }))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.message).toEqual('json: cannot unmarshal number into Go struct field requestData.data.birthday of type string');
            expect(searchUser.code).toEqual('bind_error');
        })
    });

    test("[negative] Поиск пользователя по имени: boolean, фамилии и емаил ", async ({ request }) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, { name: true }))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.message).toEqual('json: cannot unmarshal bool into Go struct field requestData.data.name of type string');
            expect(searchUser.code).toEqual('bind_error');
        })
    });
})