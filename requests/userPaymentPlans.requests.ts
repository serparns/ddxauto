import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class UserPaymentPlansRequests extends BaseRequests {
    async postUserPaymentPlans(status: number, body: object, userId: number): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.users}/${userId}${paths.paths.user_payment_plans}`, status, body);
    }
}