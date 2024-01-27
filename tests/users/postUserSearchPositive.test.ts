import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";
import {RequestSource} from "@libs/requestSource";
import {SportExperience} from "@libs/sportExperience";
import userTestData from "@data/user.json"
import requestTestData from "@data/request.json"


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
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id;
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
            const userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return userData;
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