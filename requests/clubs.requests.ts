import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class ClubsRequests extends BaseRequests {
    async getClubs(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.clubs}`, status, parameters);
    };

    async getClubById(status: number, parameters: object, clubId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.clubs}/${clubId}`, status, parameters);
    };
};