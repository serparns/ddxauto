import authCRMTestData from "@data/authCRM.json";
import cardTestData from '@data/cardData.json';
import { getBaseParameters } from "@entities/baseParameters";
import { getPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { getPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentPlan } from "@libs/paymentPlan";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import ClubsRequests from "@requests/clubs.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";


test.describe("Тест на проверку записи пользователя на тренировку", async () => {
    let clubId: number;
    let userId: number;
    let userPaymentPlanId: number;
    let transactionData: any;

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        userId = await test.step("Получить id клиента", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            const createUser = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        userPaymentPlanId = await test.step("Запрос на получение идентификатора пользовательского платежа", async () => {
            const requestBody = await getPaymentPlanRequestJson(clubId, PaymentPlan.LIGHT);
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id;
        });

        transactionData = await test.step("Создание подписки", async () => {
            const requestBody = await getPaymentCreateRequestJson(PaymentProvider.PAYMENT, userPaymentPlanId, userId);
            const transactionData = (await (await new PaymentCreateRequests(request).postPaymentCreate(Statuses.OK, requestBody)).json()).transaction;
            return transactionData.payment_widget_uri;
        });
    });

    test("Проверить что подписка в нужном статусе", async ({ page, authPage, headerBlock, clientPage, cloudPatmentPage, context }) => {
        await test.step("Перейти на страницу входа", async () => {
            await test.step("Перейти на страницу входа", async () => {
                await page.goto("")
            });

            await test.step("Заполнить форму авторизации и нажать зайти", async () => {
                await authPage.autorization(page, authCRMTestData.login, authCRMTestData.password);
            });

            await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
                await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
            });

            await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
                await page.goto(`/client/${userId}`)
                await clientPage.locators.registeredSubscribe(page).waitFor({ state: 'visible', timeout: 4000 });
            });

            const newTab = await test.step("Открыть новую вкладку оплаты ", async () => {
                const newTab = await context.newPage();
                await newTab.goto(transactionData);
                return newTab;
            });

            await test.step("Проверить что открыта страница оплаты", async () => {
                expect.soft(newTab.url()).toContain('/widgets/payment');
                await cloudPatmentPage.successfulPayment(newTab, cardTestData.number.mir, cardTestData.date, cardTestData.cvv);
                newTab.close();
            });

            await test.step("Обновить страницу и проверить что у подписки сменился статус", async () => {
                page.reload();
                await clientPage.locators.currentSubscribe(page).waitFor({ state: 'visible', timeout: 4000 });
            });
        });
    })
})