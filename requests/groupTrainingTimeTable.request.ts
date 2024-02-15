import BaseRequests from "./baseRequests.request";
import {APIResponse} from "@playwright/test";
import paths from '../api.json';

export default class GroupTrainingTimeTableRequest extends BaseRequests {
    async postGroupTrainingTimeTable(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.group_training_time_table}`, status, body);
    }
}