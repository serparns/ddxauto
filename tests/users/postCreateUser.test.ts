import {test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber,} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {Statuses} from "@libs/statuses";

const sportExperiense = ['Нет опыта', '0-6 месяцев', 'Больше 5 лет', '2-3 года', '1-2 года', '3-5 лет']
const requestBody = {
    "session_id": "123",
    "request_id": "321",
    "request_source": "crm",
    "data": {
        "email": getRandomEmail(),
        "name": "Test",
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
test.describe("Api-тест на создание клиента", async () => {
    test("[positive] Создать нового клиента", async ({request}) => {
        await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)
    })
})