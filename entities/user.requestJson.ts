import {BaseRequestJson} from "@entities/base.requestJson";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import userTestData from "@data/user.json";
import {SportExperience} from "@libs/sportExperience";

export interface UserDataRequestJson {
    email: string;
    name: string;
    last_name: string;
    middle_name: string;
    sex: string;
    phone: string;
    birthday: string;
    password: string;
    lang: string;
    user_photo_id: number
    home_club_id: number;
    club_access: boolean;
    admin_panel_access: boolean;
    group_training_registration_access: boolean;
    sport_experience: string;
}

export const getUserRequestJson =  async (clubId: number, email: string, phoneNumber: string, sportExpirence?: string,
                                          password?: string ) : Promise<BaseRequestJson<UserDataRequestJson>>  => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        data: {
            email: email,
            name: getRandomName(),
            last_name: userTestData.last_name,
            middle_name: userTestData.middle_name,
            sex: userTestData.sex.male,
            phone: phoneNumber,
            birthday: userTestData.birthday,
            password: password,
            lang: userTestData.lang,
            sport_experience: sportExpirence,
            home_club_id: clubId
        }
    }
};