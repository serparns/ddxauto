import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class DiscountsRequests extends BaseRequests {
    async getDiscounts(status: number, parameters: object,): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.discounts}`, status, parameters);
    }
}

