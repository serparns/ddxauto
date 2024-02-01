import {BaseRequestJson} from "@entities/base.requestJson";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import userTestData from "@data/user.json";
import {SportExperience} from "@libs/sportExperience";

export interface UserSearchRequestJson {
    email: string;
    name: string;
    last_name: string;
    phone: string;
    birthday: string;
}

export const getUserSearchRequestJson =  async (name?: string, email?: string, phoneNumber?: string, lastName?: string, birthday?: string,
                                         ) : Promise<BaseRequestJson<UserSearchRequestJson>>  => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        data: {
            email: email,
            name: name,
            last_name: lastName,
            phone: phoneNumber,
            birthday: birthday,

        }
    }
};