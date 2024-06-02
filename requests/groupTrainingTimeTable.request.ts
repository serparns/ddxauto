import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class GroupTrainingTimeTableRequest extends BaseRequests {
    async postGroupTrainingTimeTable(status: number, body: object): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.group_training_time_table}`, status, body);
    };

    async getGroupTrainingTimeTable(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.group_training_time_table}`, status, parameters);
    };

    async getGroupTrainingTimeTableTrainingId(status: number, parameters: object, trainingId: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.group_training_time_table}/${trainingId}`, status, parameters);
    };

    async postGroupTrainingTimeTableChange(status: number, body: object, groupTrainingId: number): Promise<APIResponse> {
        return await this.post(`${this.baseUrl}${paths.paths.group_training_time_table}/${groupTrainingId}/change`, status, body);
    };

    async deleteGroupTrainingTimeTable(status: number, parameters: object, groupTrainingId: number): Promise<APIResponse> {
        return await this.delete(`${this.baseUrl}${paths.paths.group_training_time_table}/${groupTrainingId}`, status, parameters);
    };
};