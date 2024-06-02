import requestTestData from "@data/request.json";
import { RequestSource } from "@libs/requestSource";

export async function getBaseParameters(): Promise<object> {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
    }
};

export async function getBaseFalseParameters(): Promise<object> {
    return {
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
    }
};