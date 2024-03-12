import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class TransactionRequests extends BaseRequests {
    async getTransaction(status: number, body: object, transactionId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.transactions}/${transactionId}`, status, body);
    }
}