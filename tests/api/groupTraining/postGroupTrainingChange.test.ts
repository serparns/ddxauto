import trainingTestData from "@data/training.json";
import { timeTableSchema } from "@entities/JsonSchema/timeTable.response";
import { getBaseParameters } from "@entities/baseParameters";
import { selectByTrainingId } from "@entities/db/groupTrainingTimeTables.db";
import { postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTables.requestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getDate } from "@utils/random";
import { validatorJson } from "@utils/validator";


test.describe("Api-тесты на изменение групповой тренировки", async () => {
    let groupTrainingTimeTableId: number
    let responseTrainingData: any
    let oldResponseTrainingData: any
    const trainingDay = getDate(1, 'T03:00:00Z');
    const trainingEnd = getDate(1, 'T04:00:00Z');

    const postGroupTimeTableChangeResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            startTime?: string,
            endTime?: string,
            countSeats?: number,
        }) => {
        const requestBody = await postGroupTrainingTimeTablesRequestJson(
            parameters.startTime,
            parameters.endTime,
            parameters.countSeats,
        );
        return await new GroupTrainingTimeTableRequest(request).postGroupTrainingTimeTableChange(status, requestBody, groupTrainingTimeTableId);
    };

    test.beforeAll(async ({ request, clubId, groupTrainingId }) => {
        groupTrainingTimeTableId = await test.step("получить id тренировки", async () => {
            const requestBody = await postGroupTrainingTimeTablesRequestJson
                (trainingDay, trainingEnd, trainingTestData.count_seats[5], groupTrainingId, clubId, trainingTestData.employee_id[2450]);
            return groupTrainingTimeTableId = (await (await new GroupTrainingTimeTableRequest(request)
                .postGroupTrainingTimeTable(Statuses.OK, requestBody)).json()).data[0].group_training_time_table_id;
        });

        oldResponseTrainingData = await test.step("получить информацию о конкретной тренировке", async () => {
            return oldResponseTrainingData = (await (await new GroupTrainingTimeTableRequest(request)
                .getGroupTrainingTimeTableTrainingId(Statuses.OK, await getBaseParameters(), groupTrainingTimeTableId)).json()).data[0]  // Запрос на тренировку до изменения
        });
    });

    test.afterAll(async ({ request }) => {
        await test.step("Удаление групповой тренировки", async () => {
            await new GroupTrainingTimeTableRequest(request).deleteGroupTrainingTimeTable(Statuses.NO_CONTENT, await getBaseParameters(), groupTrainingTimeTableId)
        });
    });

    test("Изменение данных в тренировке", async ({ request }) => {
        await test.step("Изменение данных в тренировке", async () => postGroupTimeTableChangeResponse(request, Statuses.OK, { countSeats: trainingTestData.count_seats[20] }))
        const countSeats = await test.step("Запрос на получения количества мест в тренировке", async () => { return (await selectByTrainingId(groupTrainingTimeTableId)).count_seats })

        responseTrainingData = await test.step("получить информацию о конкретной тренировке", async () => {   // Запрос на тренировку после изменения
            return responseTrainingData = (await (await new GroupTrainingTimeTableRequest(request)
                .getGroupTrainingTimeTableTrainingId(Statuses.OK, await getBaseParameters(), groupTrainingTimeTableId)).json()).data[0]
        });

        await test.step("Проверки", async () => {
            await validatorJson(timeTableSchema, responseTrainingData);
            expect(responseTrainingData.count_seats).not.toBe(oldResponseTrainingData.count_seats);
            expect(responseTrainingData.employee[0].id).not.toBe(oldResponseTrainingData.employee[0].id);
            expect(responseTrainingData.count_seats).toBe(countSeats);
        });
    });
}); 