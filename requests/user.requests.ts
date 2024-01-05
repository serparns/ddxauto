import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class UserRequests extends BaseRequests {
    async postCreateUser(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.users}`, status, body);
    }

    async getUser(status: number, parameters: object, userId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.users}/${userId}`, status, parameters);
    }

}


