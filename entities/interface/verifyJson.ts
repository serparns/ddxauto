import requestTestData from "@data/request.json";
import { BaseRequestJson } from "@entities/interface/base.requestJson";
import { RequestSource } from "@libs/requestSource";

export interface VerifyGetCodeRequestJson {
    user_id: number;
    contact: string;
    message_type: string;
    template: string;
}

export const postVerifyGetCodeRequestJson = async (userId: number, userContact: string): Promise<BaseRequestJson<VerifyGetCodeRequestJson>> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        data: {
            user_id: userId,
            contact: userContact,
            message_type: "email",
            template: "mail_signing_an_agreement",
        }
    };
};

export interface UserVerifyRequestJson {
    session_id: string
    request_id: string
    request_source: string
    data: [{
        user_id: number;
        contact: string;
        code: string;
        operation_type: string;
    }]
};

export const PostUserVerifyRequestJson = async (userId: number, userContact: string, verifyCode: string): Promise<UserVerifyRequestJson> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        data: [{
            user_id: userId,
            contact: userContact,
            code: verifyCode,
            operation_type: "change_user_payment_plan",
        }]
    };
};