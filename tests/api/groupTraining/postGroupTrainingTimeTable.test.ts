import trainingTestData from "@data/training.json";
import { trainingDataJsonSchema } from "@entities/JsonSchema/training.response";
import { postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTables.requestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getDate } from "@utils/random";
import { validatorJson } from "@utils/validator";

test.describe("Api-тесты на добавление групповых тренировок", async () => {
    const pastDate = getDate(-11, 'T03:00:00Z');
    const pastDateEnd = getDate(-11, 'T03:00:00Z');

    const groupTrainingTimeTablesResponse = async (
        request: APIRequestContext,
        status: Statuses,
        groupTrainingId: number,
        clubId: number,
        parameters: {
            startTime?: string,
            endTime?: string,
            countSeats: number,
        }) => {
        const requestBody = await postGroupTrainingTimeTablesRequestJson(
            parameters.startTime,
            parameters.endTime,
            parameters.countSeats,
            groupTrainingId, clubId,
        );
        return await new GroupTrainingTimeTableRequest(request).postGroupTrainingTimeTable(status, requestBody);
    }

    test("Добавить в расписание групповую тренировку на 5 мест", async ({ request, groupTrainingId, clubId }) => {
        const groupTrainingCategory = await (await test.step("Добавление групповой тренировки",
            async () => groupTrainingTimeTablesResponse(request, Statuses.OK, groupTrainingId, clubId,
                { countSeats: trainingTestData.count_seats[5] }))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingCategory.data[0]).not.toBe(null)
            await validatorJson(trainingDataJsonSchema, (await groupTrainingCategory.data[0]));
        });
    });

    test("Добавить в расписание групповую тренировку в прошлом", async ({ request, groupTrainingId, clubId }) => {
        const groupTrainingCategory = await (await test.step("Добавление групповой тренировки",
            async () => groupTrainingTimeTablesResponse(request, Statuses.OK, groupTrainingId, clubId,
                {
                    startTime: pastDate,
                    endTime: pastDateEnd,
                    countSeats: trainingTestData.count_seats[5]
                }))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingCategory.data[0]).not.toBe(null)
            await validatorJson(trainingDataJsonSchema, (await groupTrainingCategory.data[0]));
        });
    });
});