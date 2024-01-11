import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "../utils/random";
import UserRequests from "../requests/user.requests";
import {getBaseParameters} from "../entities/baseParameters";
import ClubsRequests from "../requests/clubs.requests";

const mocUserData = {
    session_id: "123",
    request_id: "123",
    request_source: "crm",
    data: {
        email: '',
        name: "Имя",
        last_name: "last_name",
        middle_name: "string",
        sex: "male",
        phone: '',
        birthday: "1999-11-11",
        password: "qwerty123",
        lang: "ru",
        club_access: true,
        admin_panel_access: true,
        group_training_registration_access: true,
        sport_experience: "Нет опыта",
    }
}

test.describe("Api-тест на создание юзера с клубом и получения данных о нем", async () => {

    test.beforeEach(() => {
        mocUserData.data.phone = getRandomPhoneNumber()
        mocUserData.data.email = getRandomEmail()
    });

    test("[positive] V2__получить юзера с подстановкой idклуба из запроса", async ({request}) => {
        const parameters = {...await getBaseParameters()};
        const getClubResponse = await new ClubsRequests(request).getClubById(200, parameters);
        const getClubData = getClubResponse.json();
        const clubId = getClubData?.data[0]?.id;
        const requestBody = {...mocUserData, data: {...mocUserData, home_club_id: clubId}}
        const postUserResponse = await new UserRequests(request).postCreateUser(200, requestBody);
        const {data: postUserData = {}} = await postUserResponse.json();
        const userId = postUserData?.id;
        const getUserResponse = await new UserRequests(request).getUser(200, parameters, userId);
        const {data: getUserData = {}} = await getUserResponse.json();

    });

    test("[positive] получить юзера с подстановкой idклуба из запроса", async ({request}) => {
        const getClubs = await new ClubsRequests(request).getClubById(200, await getBaseParameters());
        const clubId = (await getClubs.json()).data[0].id;
        const requestBody = {
            session_id: "123",
            request_id: "321",
            request_source: "crm",
            data: {
                email: getRandomEmail(),
                name: "Имя",
                last_name: "last_name",
                middle_name: "string",
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
        const createUser = await new UserRequests(request).postCreateUser(200, requestBody);
        const response = await new UserRequests(request).getUser(200, await getBaseParameters(),
            (await createUser.json()).data.id);
        expect((await response.json()).data.user_id).toEqual((await createUser.json()).data.user_id);
        expect((await response.json()).data.home_club_id).toEqual(clubId);
        expect((await response.json()).data.phone).toEqual((await createUser.json()).data.phone);
        expect((await response.json()).data.email).toEqual((await createUser.json()).data.email);
    });
})
