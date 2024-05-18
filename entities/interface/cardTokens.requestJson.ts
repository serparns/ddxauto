import requestTestData from "@data/request.json";
import { RequestSource } from "@libs/requestSource";

export interface CardTokensRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    user_id?: number;
    is_deleted?: boolean;
}

export const getCardTokensRequestJson = async (userId: number): Promise<CardTokensRequestJson> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        user_id: userId,
        is_deleted: false,
    }
};