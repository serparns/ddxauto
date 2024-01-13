import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "../../utils/random";
import UserRequests from "../../requests/user.requests";
import {getBaseParameters} from "../../entities/baseParameters";
import ClubsRequests from "../../requests/clubs.requests";

test.describe("Api-тест на создание юзера с клубом и получения данных о нем", async () => {
    test("[positive] получить юзера с подстановкой id клуба из запроса", async ({request}) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(200, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });

        const createUser   = await test.step("Получить id клиента", async () => {
            const requestBody = {
                session_id: "123",
                request_id: "321",
                request_source: "crm",
                data: {
                    email: getRandomEmail(),
                    name: "Test",
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
            const createUser = await new UserRequests(request).postCreateUser(200, requestBody)
            return createUser.json()
        });

        const getUser = await test.step("Получить информацию о пользователе", async () => {
            const response = await new UserRequests(request).getUser(200, await getBaseParameters(), createUser.data.id)
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
