import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class ClubsRequests extends BaseRequests {
    async getClub(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.clubs}`, status, parameters);
    }

    async getClubById(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.clubs}`, status, parameters);
    }
}


