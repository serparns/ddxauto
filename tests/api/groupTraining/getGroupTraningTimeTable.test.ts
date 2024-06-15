import trainingTestData from "@data/training.json";
import { timeTableSchema } from "@entities/JsonSchema/timeTable.response";
import { getGroupTrainingTimeTablesRequestJson, postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTables.requestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import { getDate } from "@utils/random";
import { validatorJson } from "@utils/validator";
import test, { expect } from "../baseTest.fixture";

test.describe("Api-тесты на получения групповых тренировок", async () => {

    let groupTrainingTimeTableId: number;
    const trainingDay = getDate(1, 'T03:00:00Z');
    const trainingEnd = getDate(1, 'T04:00:00Z');

    const getGroupTrainingTimeTablesResponse = async (
        request: APIRequestContext,
        status: Statuses,
        clubId: number,
        parameters: {
            groupTrainingCategoryId: number
        }
    ) => {
        const params = await getGroupTrainingTimeTablesRequestJson(parameters.groupTrainingCategoryId, clubId)
        return await new GroupTrainingTimeTableRequest(request).getGroupTrainingTimeTable(status, params);
    };

    test.beforeAll(async ({ request, clubId, groupTrainingData }) => {
        groupTrainingTimeTableId = await test.step("получить id тренировки", async () => {
            const requestBody = await postGroupTrainingTimeTablesRequestJson
                (trainingDay, trainingEnd, trainingTestData.count_seats[5], groupTrainingData.id, clubId);
            return groupTrainingTimeTableId = (await (await new GroupTrainingTimeTableRequest(request)
                .postGroupTrainingTimeTable(Statuses.OK, requestBody)).json()).data[0].group_training_time_table_id;
        });
    });

    test("Получить групповую тренировку", async ({ request, clubId, groupTrainingData, }) => {
        const response = await (await test.step("Получение групповой тренировки",
            async () => getGroupTrainingTimeTablesResponse(request, Statuses.OK, clubId, { groupTrainingCategoryId: groupTrainingData.group_training_category.id }))).json()

        await test.step("Проверки", async () => {
            let createdWorkout = response.data;
            let expectData = createdWorkout.find((training: { id: number }) => training.id === groupTrainingTimeTableId).id
            expect(expectData).toEqual(groupTrainingTimeTableId)
            expect(response.data[0]).not.toBe(null)
            await validatorJson(timeTableSchema, (await response.data[0]));
        })
    });
});