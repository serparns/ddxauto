import requestTestData from "@data/request.json";
import { PaymentPlan } from "@libs/paymentPlan";
import { RequestSource } from "@libs/requestSource";
import { getDate } from "@utils/random";

export interface PaymentPlanRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    club_id: number;
    start_date: string;
    payment_plan_id: number;
    verification_token: string;
    user_payment_plan_id?: number;
};

export const postPaymentPlanRequestJson = async (clubId: number, paymentPlan?: number, userPaymentPlan?: number, verificationToken?: string): Promise<PaymentPlanRequestJson> => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        club_id: clubId,
        start_date: getDate(0),
        payment_plan_id: paymentPlan != undefined ? paymentPlan : PaymentPlan.INFINITY1MONTHBARTER,
        verification_token: verificationToken != undefined ? verificationToken : "0429ed9c-6cc3-49e4-b90b-e489e60d3848",
        user_payment_plan_id: userPaymentPlan
    };
};