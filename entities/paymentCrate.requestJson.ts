import {BaseRequestJson} from "@entities/base.requestJson";
import {UserDataRequestJson} from "@entities/user.requestJson";
import {getDate} from "@utils/random";
import requestTestData from "@data/request.json";
import {RequestSource} from "@libs/requestSource";
import * as string_decoder from "string_decoder";

export interface PaymentCreateRequestJson {
    provider_id: number;
    deposit_amount: number;
    type: string;
    gate_id: number;
    user_id: number;
    user_payment_plan_id: number;
    currency: string;
    payment_service_id: number;
    employee_id: number;
    fiscal_method: string;
}
export const getPaymentCreateRequestJson = async (providerId: number, userPaymentPlanId?: number,
                                                  userId?: number, depositAmount?: number)
    : Promise<BaseRequestJson<PaymentCreateRequestJson>>  => {
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