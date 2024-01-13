import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class  NotificationsRequests extends BaseRequests {
    async getNotifications(status: number, parameters: object, userID: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${userID}${paths.paths.notifications}`, status, parameters);
    }
}


