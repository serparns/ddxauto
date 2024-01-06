import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "../utils/random";
import UserRequests from "../requests/user.requests";
import {getBaseParameters} from "../entities/baseParameters";
import ClubsRequests from "../requests/clubs.requests";


test.describe("Api-тест на получение юзера по клубу", async () => {
    test("[positive] получить юзера с подстановкой id из запроса", async ({request}) => {
        const club = new  ClubsRequests(request);
        const requestClass = new UserRequests(request);
        const parameters = await getBaseParameters();
        const clubID = await club.getClubById(200, parameters);
        const home_club_id = (await clubID.json()).data[0].id;
        const requestBody = {
            "session_id": "123","request_id": "321","request_source": "crm",
            "data": {"email": getRandomEmail(),"name": "Имя","last_name": "last_name","middle_name": "string","sex": "male",
                "phone": getRandomPhoneNumber(),"birthday": "1999-11-11","password": "qwerty123","lang": "ru",
                "club_access": true,"admin_panel_access": true,"group_training_registration_access": true,
                "sport_experience": "Нет опыта","home_club_id": home_club_id}}
        const createUser = await requestClass.postCreateUser(200, requestBody);
        const userId = (await createUser.json()).data.id;
        const phone = (await createUser.json()).data.phone;
        const email = (await createUser.json()).data.email;
        const response = await requestClass.getUser(200, parameters, userId);
        expect((await response.json()).data.user_id).toEqual((await createUser.json()).data.user_id)
        expect((await response.json()).data.home_club_id).toEqual(home_club_id)
        expect((await response.json()).data.phone).toEqual(phone)
        expect((await response.json()).data.email).toEqual(email)
    })
})