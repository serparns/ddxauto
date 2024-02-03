import {BaseRequestJson} from "@entities/base.requestJson";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";

export interface PaymentCreateRequestJson {
    session_id: string;
    request_id: string;
    request_source: string;
    provider_id: number | undefined;
    deposit_amount: number | undefined;
    type: string;
    gate_id: number;
    user_id: number;
    user_payment_plan_id: number | undefined
    currency: string;
    payment_service_id: number;
    employee_id: number;
    fiscal_method: string;
}
export const getPaymentCreateRequestJson = async (userId: number, userPaymentPlanId?: number, providerId?: number,
                                                   depositAmount?: number)
    : Promise<PaymentCreateRequestJson>  => {
    return {
        session_id: requestTestData.session_id,
        request_id: requestTestData.request_id,
        request_source: RequestSource.CRM,
        provider_id: providerId,
        deposit_amount: depositAmount,
        type: "payment",
        gate_id: 1,
        user_id: userId,
        user_payment_plan_id: userPaymentPlanId,
        currency: "RUB",
        payment_service_id: 2,
        employee_id: 3134,
        fiscal_method: "OrangeData"

    }
}