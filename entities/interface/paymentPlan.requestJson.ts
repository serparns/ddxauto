import requestTestData from "@data/request.json";
import { RequestSource } from "@libs/requestSource";
import { getDate } from "@utils/random";

export interface PaymentPlanRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    club_id: number;
    start_date: string;
    payment_plan_id: number
    verification_token: string
}

export const getPaymentPlanRequestJson = async (clubId: number): Promise<PaymentPlanRequestJson> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        club_id: clubId,
        start_date: getDate(),
        payment_plan_id: 48,
        verification_token: "0429ed9c-6cc3-49e4-b90b-e489e60d3848",
    }
};