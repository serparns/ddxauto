import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class CardTokensRequests extends BaseRequests {
    async getCardTokens(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.card_tokens}`, status, parameters);
    };

    async getCardTokensCardTokenId(status: number, parameters: object, CardTokenId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.card_tokens}/${CardTokenId}`, status, parameters);
    };
};