import {APIRequestContext, expect, test} from "@playwright/test";
import {getDate, getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";

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
        const requestBody = {
            session_id: "234",
            request_id: "123",
            request_source: "123",
            data: {
                name: parameters.name,
                email: parameters.email,
                phone: parameters.phone,
                last_name: parameters.lastName,
                birthday: parameters.birthday
            }
        }
        return await new UsersRequests(request).postUsersSearch(status, requestBody);
    }

    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        userData = await test.step("создать пользователя и получить данные о нем", async () => {
            const requestBody = {
                session_id: "123",
                request_id: "321",
                request_source: "123",
                data: {
                    email: getRandomEmail(),
                    name: getRandomName(),
                    last_name: "Test",
                    middle_name: "",
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
            return userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    })
    test("[negative] поиск пользователя по номеру телефона", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.NOT_FOUND, {phone: "903203"}))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.code).toEqual('data_find_error');
            expect(searchUser.message).toEqual('user not found');
        })
    });

    test("[negative] Поиск пользователя по имени, фамилии и дате рождения", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.NOT_FOUND, {
                birthday: getDate(),
                name: userData.name,
                lastName: userData.last_name
            }))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.code).toEqual('data_find_error');
            expect(searchUser.message).toEqual('user not found');
        })
    });

    test("[negative] Поиск пользователя по имени, фамилии и емаил ", async ({request}) => {
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

    test("[negative] Поиск пользователя по номеру телефона: array", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя по номеру телефона: array",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, {phone: {userData: "phone"}}))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.message).toEqual('json: cannot unmarshal object into Go struct field requestData.data.phone of type string');
            expect(searchUser.code).toEqual('bind_error');
        })
    });

    test("[negative] Поиск пользователя по имени, фамилии и дате рождения: int", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, {birthday: clubId}))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.message).toEqual('json: cannot unmarshal number into Go struct field requestData.data.birthday of type string');
            expect(searchUser.code).toEqual('bind_error');
        })
    });

    test("[negative] Поиск пользователя по имени: boolean, фамилии и емаил ", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, {name: true}))).json()).error;

        await test.step("Проверки", async () => {
            expect(searchUser.message).toEqual('json: cannot unmarshal bool into Go struct field requestData.data.name of type string');
            expect(searchUser.code).toEqual('bind_error');
        })
    });
})