import {APIRequestContext, expect, test} from "@playwright/test";
import {Statuses} from "@libs/statuses";
import {postGroupTrainingTimeTablesRequestJson} from "@entities/interface/groupTrainingTimeTablesRequestJson";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";
import GroupTrainingCategoriesRequests from "@requests/groupTrainingRequests.request";


test.describe("Api-тесты на получения групповых тренировок", async () => {
    let groupTrainingId: number;
    let clubId: number;
    let groupTrainingTimeTableId : any

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        groupTrainingId = await test.step("получить id групповой тренировки", async () => {
            return groupTrainingId = (await (await new GroupTrainingCategoriesRequests(request).getGroupTrainingCategories(Statuses.OK, await getBaseParameters())).json()).data[0].id;
        });

        groupTrainingTimeTableId = await test.step("получить id тренировки", async () => {
            const requestBody = await postGroupTrainingTimeTablesRequestJson(groupTrainingId, clubId);
            return groupTrainingTimeTableId = await new GroupTrainingTimeTableRequest(request).postGroupTrainingTimeTable(Statuses.OK, requestBody);
        });
    })
})