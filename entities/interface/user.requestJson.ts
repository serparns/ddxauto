import requestTestData from "@data/request.json";
import trainingTestData from "@data/training.json";
import userTestData from "@data/user.json";
import { BaseRequestJson } from "@entities/interface/base.requestJson";
import { RequestSource } from "@libs/requestSource";
import { getRandomName } from "@utils/random";

export interface UserDataRequestJson {
    sport_experience: string;
    password: string;
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

export const getUserRequestJson = async (clubId: number, email: string, phoneNumber: string, sportExperience?: string,
    password?: string): Promise<BaseRequestJson<UserDataRequestJson>> => {
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
            password: password != undefined ? password : '',
            lang: userTestData.lang,
            sport_experience: sportExperience != undefined ? sportExperience : '',
            home_club_id: clubId,
            user_photo_id: 12,
            club_access: userTestData.club_access.true,
            admin_panel_access: userTestData.admin_panel_access.false,
            group_training_registration_access: userTestData.group_training_registration_access.true
        }
    }
};

export interface UserBlockRequestJson {
    note: {
        text: string;
        employee_id: number;
    }
    club_access: boolean;
}

export const postUserBlockRequestJson = async (): Promise<BaseRequestJson<UserBlockRequestJson>> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        data: {
            note: {
                text: "Где деньги Лебовски",
                employee_id: trainingTestData.employee_id[391]
            },
            club_access: false
        }
    }
};