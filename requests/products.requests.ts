import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class ProductRequests extends BaseRequests {
    async getProducts(status: number, parameters: object,): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.products}`, status, parameters);
    };
};