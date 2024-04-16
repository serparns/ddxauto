import { getBaseParameters } from "@entities/baseParameters";
import { postGroupTrainingUsersRequestJson } from "@entities/interface/groupTrainigUserRequestJson";
import { postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTablesRequestJson";
import { getPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { getPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getRandomEmail, getRandomPhoneNumber, getTomorrow, getTomorrowEnd } from "@utils/random";


test.describe("Api-тесты на запись пользователя на тренировку", async () => {
    let groupTrainingId: any;
    let clubId: number;
    let groupTrainingTimeTableId: number
    let userId: number;
    let userPaymentPlanId: number;
    const trainingDay = getTomorrow()
    const trainingEnd = getTomorrowEnd()

    const postGroupTrainingUserResponse = async (
        request: APIRequestContext,
        status: Statuses,
    ) => {
        const requestBody = await postGroupTrainingUsersRequestJson(groupTrainingTimeTableId, userId)
        return await new GroupTrainingRequests(request).postGroupTrainingUsers(status, requestBody);
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

        userId = await test.step("Получить id клиента", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            const createUser = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        userPaymentPlanId = await test.step("Запрос на получение идентификатора пользовательского платежа", async () => {
            const requestBody = await getPaymentPlanRequestJson(clubId);
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id
        });

        await test.step("Создание подписки", async () => {
            const requestBody = await getPaymentCreateRequestJson(PaymentProvider.RECURRENT, userPaymentPlanId, userId);
            return await new PaymentCreateRequests(request).postPaymentCreate(Statuses.OK, requestBody);
        });
    });

    test("Записать пользователя на тренировку", async ({ request }) => {
        const groupTrainingUsers = await (await test.step("Запись пользователя на тренировку",
            async () => postGroupTrainingUserResponse(request, Statuses.OK,))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingUsers.data[0].booking_status).toBe("booked")
        });
    });
});