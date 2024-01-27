import {APIRequestContext, expect, test} from "@playwright/test";
import {getDate, getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";
import {SportExperience} from "@libs/sportExperience";
import userTestData from "@data/user.json";

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
            session_id: requestTestData.session_id,
            request_id: requestTestData.request_id,
            request_source: RequestSource.CRM,
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
            return userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    })
    test("[negative] поиск пользователя по номеру телефона", async ({request}) => {
        const searchUser = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.NOT_FOUND, {phone: "111111111"}))).json()).error;

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