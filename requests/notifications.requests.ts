import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class NotificationsRequests extends BaseRequests {
    async getNotifications(status: number, parameters: object, userID: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${userID}${paths.paths.notifications}`, status, parameters);
    };
};