import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class PaymentCreateRequests extends BaseRequests {
    async postPaymentCreate(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.payment_create}`, status, body);
    };

    async postV2PaymentCreate(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}/v2${paths.paths.payment_create}`, status, body);
    };

    async postFreezesCreate(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.freezes_create}`, status, body);
    };
};