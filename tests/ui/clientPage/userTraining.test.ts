import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { getBaseParameters } from "@entities/baseParameters";
import { selectByUserIdGroupTrainingTimeTableId } from "@entities/db/groupTrainigUsers.db";
import { postGroupTrainingUsersRequestJson } from "@entities/interface/groupTrainigUserRequestJson";
import { postGroupTrainingTimeTablesRequestJson } from "@entities/interface/groupTrainingTimeTablesRequestJson";
import { getPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { getPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import GroupTrainingTimeTableRequest from "@requests/groupTrainingTimeTable.request";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getRandomEmail, getRandomPhoneNumber, getTomorrow, getTomorrowEnd } from "@utils/random";


test.describe("Тест на проверку записи пользователя на тренировку", async () => {
    let groupTrainingId: any;
    let clubId: number;
    let groupTrainingTimeTableId: number
    let userId: number;
    let userPaymentPlanId: number;
    const trainingDay = getTomorrow()
    const trainingEnd = getTomorrowEnd()

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

        await test.step("Запись пользователя на тренировку", async () => {
            const requestBody = await postGroupTrainingUsersRequestJson(groupTrainingTimeTableId, userId)
            return await new GroupTrainingRequests(request).postGroupTrainingUsers(Statuses.OK, requestBody);
        });
    });

    test("Проветка отоброжения тренировки ", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await page.getByPlaceholder("Логин").fill(authCRMTestData.login);
            await page.getByPlaceholder("Пароль").fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Войти' }).click();
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await page.locator("//input[@data-testid='phone-input']").waitFor({ state: "visible", timeout: 3000 });
        });

        const trainingName = await test.step("Получить информацию о подписке", async () => {
            return (await selectByUserIdGroupTrainingTimeTableId(userId, groupTrainingTimeTableId)).user_id
        })

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`${api.urls.base_url_CRM}/client/${trainingName}`)
        });
    });// TODO Дописать тест, потребуется еще один запрос на получения названия тренировки

});