import authCRMTestData from "@data/authCRM.json";
import trainingTestData from "@data/training.json";
import { selectNameGroupTraining } from "@entities/db/groupTraining.db";
import { selectByUserIdGroupTrainingTimeTableId } from "@entities/db/groupTrainingUsers.db";
import { postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTables.requestJson";
import { postGroupTrainingUsersRequestJson } from "@entities/interface/groupTrainingUser.requestJson";
import { postPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { postPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { expect } from "@playwright/test";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getDate, getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import test from "../baseTest.fixture";

test.describe("Тест на проверку записи пользователя на тренировку", async () => {
    let groupTrainingTimeTableId: number
    let userId: number;
    let userPaymentPlanId: number;
    const trainingDay = getDate(1, 'T03:00:00Z')
    const trainingEnd = getDate(1, 'T04:00:00Z')

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

        await test.step("Запись пользователя на тренировку", async () => {
            const requestBody = await postGroupTrainingUsersRequestJson(groupTrainingTimeTableId, userId)
            return await new GroupTrainingRequests(request).postGroupTrainingUsers(Statuses.OK, requestBody);
        });
    });

    test("Проверка отображения тренировки", async ({ page, authPage, headerBlock, clientPage, groupTrainingData }) => {
        await test.step("Перейти на страницу входа", async () => {
            await test.step("Перейти на страницу входа", async () => {
                await page.goto("")
            });

            await test.step("Заполнить форму авторизации и нажать зайти", async () => {
                await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
            });

            await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
                await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
            });

            const userIdByTraining = await test.step("Получить пользователя на тренировке", async () => {
                return (await selectByUserIdGroupTrainingTimeTableId(userId, groupTrainingTimeTableId)).user_id
            })

            const groupTrainingName = await test.step("Получить название тренировки", async () => {
                return (await selectNameGroupTraining(groupTrainingData.id)).name
            })

            await test.step(`Перейти на страницу клиента и проверить что пользователь записан на тренировку ${groupTrainingName}`, async () => {
                await page.goto(`/client/${userIdByTraining}`)
                await expect.soft(clientPage.locators.activeEntryGroupTraining(page, groupTrainingName)).toBeVisible();
            });
        });
    });
})