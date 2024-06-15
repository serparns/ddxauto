import trainingTestData from "@data/training.json";
import { postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTables.requestJson";
import { postGroupTrainingUsersRequestJson } from "@entities/interface/groupTrainingUser.requestJson";
import { postPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { postPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getDate, getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import test, { expect } from "../baseTest.fixture";

test.describe("Api-тесты на запись пользователя на тренировку", async () => {
    let groupTrainingTimeTableId: number
    let userId: number;
    let userPaymentPlanId: number;
    const trainingDay = getDate(1, 'T03:00:00Z');
    const trainingEnd = getDate(1, 'T04:00:00Z');

    const postGroupTrainingUserResponse = async (
        request: APIRequestContext,
        status: Statuses,
    ) => {
        const requestBody = await postGroupTrainingUsersRequestJson(groupTrainingTimeTableId, userId)
        return await new GroupTrainingRequests(request).postGroupTrainingUsers(status, requestBody);
    };

    test.beforeAll(async ({ request, clubId, groupTrainingData }) => {
        groupTrainingTimeTableId = await test.step("получить id тренировки", async () => {
            const requestBody = await postGroupTrainingTimeTablesRequestJson(trainingDay, trainingEnd, trainingTestData.count_seats[5], groupTrainingData.id, clubId);
            return groupTrainingTimeTableId = (await (await new GroupTrainingTimeTableRequest(request)
                .postGroupTrainingTimeTable(Statuses.OK, requestBody)).json()).data[0].group_training_time_table_id;
        });

        userId = await test.step("Получить id клиента", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            const createUser = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        userPaymentPlanId = await test.step("Запрос на создание идентификатора пользовательского платежа", async () => {
            const requestBody = await postPaymentPlanRequestJson(clubId);
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id
        });

        await test.step("Клиентский запрос на оплату", async () => {
            const requestBody = await postPaymentCreateRequestJson(PaymentProvider.RECURRENT, userPaymentPlanId, userId);
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