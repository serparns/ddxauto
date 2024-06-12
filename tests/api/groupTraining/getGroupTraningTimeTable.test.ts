import trainingTestData from "@data/training.json";
import { timeTableSchema } from "@entities/JsonSchema/timeTable.response";
import { getBaseParameters } from "@entities/baseParameters";
import { getGroupTrainingTimeTablesRequestJson, postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTables.requestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getDate } from "@utils/random";
import { validatorJson } from "@utils/validator";


test.describe("Api-тесты на получения групповых тренировок", async () => {
    let groupTrainingId: any;
    let groupTrainingTimeTableId: number;
    const trainingDay = getDate(1, 'T03:00:00Z');
    const trainingEnd = getDate(1, 'T04:00:00Z');

    const getGroupTrainingTimeTablesResponse = async (
        request: APIRequestContext,
        status: Statuses,
        clubId: number,
    ) => {
        const params = await getGroupTrainingTimeTablesRequestJson(groupTrainingId.group_training_category.id, clubId)
        return await new GroupTrainingTimeTableRequest(request).getGroupTrainingTimeTable(status, params);
    };

    test.beforeAll(async ({ request, clubId }) => {
        groupTrainingId = await test.step("получить id групповой тренировки", async () => {
            return groupTrainingId = (await (await new GroupTrainingRequests(request).getGroupTraining(Statuses.OK, await getBaseParameters())).json()).data[0]
        });

        groupTrainingTimeTableId = await test.step("получить id тренировки", async () => {
            const requestBody = await postGroupTrainingTimeTablesRequestJson
                (trainingDay, trainingEnd, trainingTestData.count_seats[5], groupTrainingId.id, clubId);
            return groupTrainingTimeTableId = (await (await new GroupTrainingTimeTableRequest(request)
                .postGroupTrainingTimeTable(Statuses.OK, requestBody)).json()).data[0].group_training_time_table_id;
        });
    });

    test("Получить групповую тренировку", async ({ request, clubId }) => {
        const groupTrainingCategory = await (await test.step("Получение групповой тренировки",
            async () => getGroupTrainingTimeTablesResponse(request, Statuses.OK, clubId))).json()

        await test.step("Проверки", async () => {
            let createdWorkout = groupTrainingCategory.data;
            let expectData = createdWorkout.find((training: { id: number }) => training.id === groupTrainingTimeTableId).id
            expect(expectData).toEqual(groupTrainingTimeTableId)
            expect(groupTrainingCategory.data[0]).not.toBe(null)
            await validatorJson(timeTableSchema, (await groupTrainingCategory.data[0]));
        })
    });
});