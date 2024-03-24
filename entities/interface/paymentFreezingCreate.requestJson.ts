import requestTestData from "@data/request.json";
import { RequestSource } from "@libs/requestSource";
import { getDate } from "@utils/random";

export interface PaymentFreezingCreateRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    provider_id?: number;
    gate_id: number;
    user_id?: number;
    user_payment_plan_id?: number;
    currency: string;
    payment_service_id: number;
    employee_id: number;
    products: object;
    start_date: string;
    end_date: string;
    is_technical: boolean;
};

export const getPaymentFreezingCreateRequestJson = async (providerId?: number, userPaymentPlanId?: number, userId?: number)
    : Promise<PaymentFreezingCreateRequestJson> => {
    return {
        request_id: requestTestData.request_id,
        session_id: requestTestData.session_id,
        request_source: RequestSource.CRM,
        gate_id: 6,
        is_technical: false,
        provider_id: providerId,
        user_id: userId,
        start_date: getDate(),
        end_date: getDate(),
        user_payment_plan_id: userPaymentPlanId,
        payment_service_id: 2,
        products: [
            {
                id: 116,
                quantity: 1
            }
        ],
        currency: "RUB",
        employee_id: 4650,
    }
}