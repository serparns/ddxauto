import {getRandomEmail, getRandomPhoneNumber} from "../utils/random";

export async function dataUserBody(): Promise<object> {
    return {
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
            "sport_experience": "Больше 5 лет"
        }
    }
}