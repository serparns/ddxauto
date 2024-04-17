import { getBaseParameters } from "@entities/baseParameters";
import { postGroupTrainingTimeTablesChangeRequestJson, postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTablesRequestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import { getTomorrow, getTomorrowEnd } from "@utils/random";


test.describe("Api-тесты на изменение групповой тренировки", async () => {
    let groupTrainingId: any;
    let clubId: number;
    let groupTrainingTimeTableId: number
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
        await test.step("Удаление групповой тренировки", async () => {
            return groupTrainingId = await new GroupTrainingTimeTableRequest(request).deleteGroupTrainingTimeTable(Statuses.NO_CONTENT, await getBaseParameters(), groupTrainingTimeTableId)
        });

    })



    test("Изменение данных в тренировке", async ({ request }) => {
        const traningChange = await test.step("Изменение данных в тренировке", async () => postGroupTimeTableChangeResponse(request, Statuses.OK,))
    });
}); //TODO прикрутить проверку через базу