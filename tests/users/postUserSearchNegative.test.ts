import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";

test.describe("Api-тесты на поиск пользователя по параметрам", async () => {
    let userData: any
    let clubId: number;

    const userSearchResponse = async (request: APIRequestContext, status: Statuses,
                                      phone: object | null, name: number | null| boolean, lastName: boolean | null,
                                      email: string | null, birthday: any | null) => {
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
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
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
            return userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    })
    test("[negative] Поиск пользователя по номеру телефона:array", async ({request}) => {

        const serchByPhone = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, {userData:'phone'}, null, null, null, null))).json()).error;

        await test.step("Проверки", async () => {
            expect(serchByPhone.message).toEqual('json: cannot unmarshal object into Go struct field requestData.data.phone of type string');
            expect(serchByPhone.code).toEqual('bind_error');
        })
    });

    test("[negative] Поиск пользователя по имени, фамилии и дате рождения: int", async ({request}) => {
        const serchByPhone = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, null, userData.name, userData.last_name, null, clubId))).json()).error;

        await test.step("Проверки", async () => {
            expect(serchByPhone.message).toEqual('json: cannot unmarshal number into Go struct field requestData.data.birthday of type string');
            expect(serchByPhone.code).toEqual('bind_error');
        })
    });

    test("[negative] Поиск пользователя по имени:boolean, фамилии и емаил ", async ({request}) => {
        const serchByPhone = (await (await test.step("поиск пользователя",
            async () => userSearchResponse(request, Statuses.BAD_REQUEST, null, true, userData.last_name, userData.email, null))).json()).error;

        await test.step("Проверки", async () => {
            expect(serchByPhone.message).toEqual('json: cannot unmarshal bool into Go struct field requestData.data.name of type string');
            expect(serchByPhone.code).toEqual('bind_error');
        })
    });

})