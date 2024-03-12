import { APIResponse } from "@playwright/test";
import paths from '../api.json';
import BaseRequests from "./baseRequests.request";

export default class GroupTrainingRequests extends BaseRequests {
    async getGroupTrainingCategories(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.group_training_categories}`, status, parameters);
    }

    async getGroupTrainingCategoriesId(status: number, parameters: object, id: number): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.group_training_categories}${id}`, status, parameters);
    }

    async getGroupTraining(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.group_trainings}`, status, parameters);
    }
}