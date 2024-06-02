import trainingTestData from "@data/training.json";
import { trainingDataJsonSchema } from "@entities/JsonSchema/training.response";
import { getBaseParameters } from "@entities/baseParameters";
import { postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTables.requestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import { validatorJson } from "@utils/validator";

test.describe("Api-тесты на добавление групповых тренировок", async () => {
    let groupTrainingId: number;
    let clubId: number;

    const groupTrainingTimeTablesResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            startTime: string,
            endTime: string,
            countSeats: number,
            isRepeat: boolean,
            repeatRule?: string
        }) => {
        const requestBody = await postGroupTrainingTimeTablesRequestJson(groupTrainingId, clubId,
            parameters.startTime,
            parameters.endTime,
            parameters.countSeats,
            parameters.isRepeat,
            parameters.repeatRule
        );
        return await new GroupTrainingTimeTableRequest(request).postGroupTrainingTimeTable(status, requestBody);
    }

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        groupTrainingId = await test.step("получить id групповой тренировки", async () => {
            return groupTrainingId = (await (await new GroupTrainingRequests(request).getGroupTrainingCategories(Statuses.OK, await getBaseParameters())).json()).data[0].id;
        });
    });

    test("Добавить в расписание групповую тренировку на 5 мест", async ({ request }) => {
        const groupTrainingCategory = await (await test.step("Добавление групповой тренировки",
            async () => groupTrainingTimeTablesResponse(request, Statuses.OK,
                {
                    startTime: trainingTestData.start_time.future,
                    endTime: trainingTestData.start_time.future,
                    countSeats: trainingTestData.count_seats[5],
                    isRepeat: trainingTestData.is_repeat.false
                }))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingCategory.data[0]).not.toBe(null)
            await validatorJson(trainingDataJsonSchema, (await groupTrainingCategory.data[0]));
        });
    });

    test("Добавить в расписание групповую тренировку в прошлом", async ({ request }) => {
        const groupTrainingCategory = await (await test.step("Добавление групповой тренировки",
            async () => groupTrainingTimeTablesResponse(request, Statuses.OK,
                {
                    startTime: trainingTestData.start_time.backInTime,
                    endTime: trainingTestData.start_time.backInTime,
                    countSeats: trainingTestData.count_seats[5],
                    isRepeat: trainingTestData.is_repeat.false
                }))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingCategory.data[0]).not.toBe(null)
            await validatorJson(trainingDataJsonSchema, (await groupTrainingCategory.data[0]));
        });
    });
});