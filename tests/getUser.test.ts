import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "../utils/random";
import UserRequests from "../requests/user.requests";
import {getBaseParameters} from "../entities/baseParameters";

const requestBody = {
    "session_id": "123",
    "request_id": "321",
    "request_source": "crm",
    "data": {
        "email": getRandomEmail(),
        "name": "Имя",
        "last_name": "last_name",
        "middle_name": "string",
        "sex": "male",
        "phone": getRandomPhoneNumber(),
        "birthday": "1999-11-11",
        "password": "qwerty123",
        "lang": "ru",
        "home_club_id": 1,
        "club_access": true,
        "admin_panel_access": true,
        "group_training_registration_access": true,
        "sport_experience": "Нет опыта"
    }
}
test.describe("Api-тест на получение юзера по клубу", async () => {
    test.only("[positive] получить юзера с подстановкой id из запроса", async ({request}) => {
        const requestClass = new UserRequests(request);
        const parameters = await getBaseParameters();
        const createUser = await requestClass.postCreateUser(200, requestBody);
        const userId = (await createUser.json()).data.id;
        const response = await requestClass.getUser(200, parameters, userId);
        expect((await response.json()).data.user_id).toEqual((await createUser.json()).data.user_id)
    })
})