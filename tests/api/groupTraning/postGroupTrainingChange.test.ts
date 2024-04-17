import { timeTableShema } from "@entities/JsonSchema/timeTable.response";
import { getBaseParameters } from "@entities/baseParameters";
import { selectByTrarningId } from "@entities/db/groupTrainingTimeTables.db";
import { postGroupTrainingTimeTablesChangeRequestJson, postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTablesRequestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import { getTomorrow, getTomorrowEnd } from "@utils/random";
import { validatorJson } from "@utils/validator";


test.describe("Api-тесты на изменение групповой тренировки", async () => {
    let groupTrainingId: any;
    let clubId: number;
    let groupTrainingTimeTableId: number
    let responseData: any
    const trainingDay = getTomorrow()
    const trainingEnd = getTomorrowEnd()

    const postGroupTimeTableChangeResponse = async (
        request: APIRequestContext,
        status: Statuses,
    ) => {
        const requestBody = await postGroupTrainingTimeTablesChangeRequestJson()
        return await new GroupTrainingTimeTableRequest(request).postGroupTrainingTimeTableChange(status, requestBody, groupTrainingTimeTableId);
    }

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        groupTrainingId = await test.step("получить id групповой тренировки", async () => {
            return groupTrainingId = (await (await new GroupTrainingRequests(request).getGroupTraining(Statuses.OK, await getBaseParameters())).json()).data[0]
        });

        groupTrainingTimeTableId = await test.step("получить id тренировки", async () => {
            const requestBody = await postGroupTrainingTimeTablesRequestJson(groupTrainingId.id, clubId, trainingDay, trainingEnd);
            return groupTrainingTimeTableId = (await (await new GroupTrainingTimeTableRequest(request)
                .postGroupTrainingTimeTable(Statuses.OK, requestBody)).json()).data[0].group_training_time_table_id;
        });
    });

    test.afterAll(async ({ request }) => {
        responseData = await test.step("получить информацию о конкретной тренировке", async () => {
            return responseData = (await (await new GroupTrainingTimeTableRequest(request)
                .getGroupTrainingTimeTableTraningId(Statuses.OK, await getBaseParameters(), groupTrainingTimeTableId)).json()).data[0]
        });

        const countSeats = await test.step("Получить пользователя на тренировке", async () => { return (await selectByTrarningId(groupTrainingTimeTableId)).count_seats })
        await test.step("Проверки", async () => {
            await validatorJson(timeTableShema, responseData);
            expect(responseData.count_seats).toBe(countSeats);            
        })

        await test.step("Удаление групповой тренировки", async () => {
            return groupTrainingId = await new GroupTrainingTimeTableRequest(request).deleteGroupTrainingTimeTable(Statuses.NO_CONTENT, await getBaseParameters(), groupTrainingTimeTableId)
        });
    })

    test("Изменение данных в тренировке", async ({ request }) => {
        const traningChange = await test.step("Изменение данных в тренировке", async () => postGroupTimeTableChangeResponse(request, Statuses.OK,))
    });
}); 