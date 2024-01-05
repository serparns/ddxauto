import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class  AccessCardsRequests extends BaseRequests {
    async postAccessCards(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.access_cards}`, status, body);
    }
    async getAccessCardsById(status: number, parameters: object, accessCardId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.access_cards}/${accessCardId}`, status, parameters);
    }
}


