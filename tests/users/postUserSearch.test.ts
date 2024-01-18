import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber, getRandomName} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";
import {log} from "@utils/logger";

test.describe("Api-тесты на поиск пользователя по параметрам", async () => {
    let userData: object
    let clubId: number;

    const userSearchResponse = async (request: APIRequestContext, status: Statuses,
                                      phone: string|null, name: string|null, lastName: string|null, email: string|null,
                                      birthday: string|null) => {
        const requestBody = {
            session_id: "234",
            request_id: "123",
            request_source: "123",
            data: {
                name: name,
                email: email,
                phone: phone,
                last_name: lastName,
                birthday: birthday
            }
        }
        return await new UsersRequests(request).postUsersSearch(status, requestBody);

    }

    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id;
        });
    })

    test.beforeAll(async ({request}) => {
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
            const userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return userData;


        });

    })
    test("[positive] Поиск пользователя по номеру телефона", async ({request}) => {

        const serchByphone = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.OK, userData["phone"], null, null, null, null))).json()).data[0];


        await test.step("Проверки", async () => {
            expect(serchByphone.id).toEqual(userData["id"]);
            console.log(userData["id"])
        })
    });

    test("[positive] Поиск пользователя по имени, фамилии и дате рождения", async ({request}) => {

        const serchByphone = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.OK, null, userData["name"], userData["last_name"], null, userData["birthday"]))).json()).data[0];


        await test.step("Проверки", async () => {
            expect(serchByphone.id).toEqual(userData["id"]);
            console.log(userData["id"])
        })
    });

    test("[positive] Поиск пользователя по имени, фамилии и емаил ", async ({request}) => {

        const serchByphone = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.OK, null, userData["name"], userData["last_name"], userData["email"], null))).json()).data[0];


        await test.step("Проверки", async () => {
            expect(serchByphone.id).toEqual(userData["id"]);
            console.log(userData["id"])
        })
    });

})