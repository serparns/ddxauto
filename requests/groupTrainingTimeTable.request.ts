import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class GroupTrainingTimeTableRequest extends BaseRequests {
    async postGroupTrainingTimeTable(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.group_training_time_table}`, status, body);
    }

    async getGroupTrainingTimeTable(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.group_training_time_table}`, status, parameters);
    }
}