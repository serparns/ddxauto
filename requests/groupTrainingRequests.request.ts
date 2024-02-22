import BaseRequests from "./baseRequests.request";
import { APIResponse } from "@playwright/test";
import paths from '../api.json';

export default class GroupTrainingCategoriesRequests extends BaseRequests {
    async getGroupTrainingCategories(status: number, parameters: object): Promise<APIResponse> {
        return await this.get(`${this.baseUrl}${paths.paths.group_training_categories}`, status, parameters);
    }
}