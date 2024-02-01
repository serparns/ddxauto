import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class TransactionRequests extends BaseRequests {
    async getTransaction(status: number, body: object, transactionId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.transactions}/${transactionId}`, status, body);
    }
}