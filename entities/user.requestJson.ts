import {BaseRequestJson} from "@entities/base.requestJson";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";
import {getRandomName} from "@utils/random";
import userTestData from "@data/user.json";

export interface UserDataRequestJson {
    sport_experience?: string;
    password?: string;
    email: string;
    name: string;
    last_name: string;
    middle_name: string;
    sex: string;
    phone: string;
    birthday: string;
    lang: string;
    user_photo_id: number
    home_club_id: number;
    club_access: boolean;
    admin_panel_access: boolean;
    group_training_registration_access: boolean;
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
            home_club_id: clubId,
            user_photo_id: 12,
            club_access: userTestData.club_access.true,
            admin_panel_access: userTestData.admin_panel_access.false,
            group_training_registration_access: userTestData.group_training_registration_access.true
        }
    }
};