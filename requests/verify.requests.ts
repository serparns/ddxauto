import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class VerifyRequests extends BaseRequests {
    async postGetCode(status: number, requestData: any): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.get_code}`, status, requestData);
    }
}