import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class  PaymentCreateRequests extends BaseRequests {
    async postPaymentCreate(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.payment_create}`, status, body);
    }
}


