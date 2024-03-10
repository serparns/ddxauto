import { timeTableShema } from "@entities/JsonSchema/timeTable.response";
import { getBaseParameters } from "@entities/baseParameters";
import { getGroupTrainingTimeTablesRequestJson, postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTablesRequestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import GroupTrainingCategoriesRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import { validatorJson } from "@utils/validator";


test.describe("Api-тесты на получения групповых тренировок", async () => {
    let groupTrainingId: number;
    let clubId: number;
    let groupTrainingTimeTableId: number

    const getGroupTrainingTimeTablesResponse = async (
        request: APIRequestContext,
        status: Statuses,
    ) => {
        const params = await getGroupTrainingTimeTablesRequestJson(groupTrainingId)
        return await new GroupTrainingTimeTableRequest(request).getGroupTrainingTimeTable(status, params);
    }

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        groupTrainingId = await test.step("получить id групповой тренировки", async () => {
            return groupTrainingId = (await (await new GroupTrainingCategoriesRequests(request).getGroupTrainingCategories(Statuses.OK, await getBaseParameters())).json()).data[0].id;
        });

        groupTrainingTimeTableId = await test.step("получить id тренировки", async () => {
            const requestBody = await postGroupTrainingTimeTablesRequestJson(groupTrainingId, clubId);
            return groupTrainingTimeTableId = (await (await new GroupTrainingTimeTableRequest(request)
                .postGroupTrainingTimeTable(Statuses.OK, requestBody)).json()).data[0].group_training_time_table_id;
        });
    })

    test("Получить групповую тренировку", async ({ request }) => {
        const groupTrainingCategory = await (await test.step("Получение групповой тренировки",
            async () => getGroupTrainingTimeTablesResponse(request, Statuses.OK,))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingCategory.data[0]).not.toBe(null)
            await validatorJson(timeTableShema, (await groupTrainingCategory.data[0]));
        }) //TODO Разобраться как же всетаки работает фильтр по категории
    });
})