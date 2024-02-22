import { expect, test } from "@playwright/test";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import UsersRequests from "@requests/users.requests";
import { getBaseParameters } from "@entities/baseParameters";
import ClubsRequests from "@requests/clubs.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import TransactionRequests from "@requests/transaction.requests";
import { Statuses } from "@libs/statuses";
import { PaymentProvider } from "@libs/providers";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { getPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";

test.describe("Api-тесты на регистрацию подписки пользователя", async () => {
    test("[positive] регистрация подписки", async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });

        const userId = await test.step("Получить id клиента", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            const createUser = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        const paymentId = await test.step("Отправить запрос на создание подписки", async () => {
            const requestBody = await getPaymentPlanRequestJson(clubId);
            const userPayment = (await (await new UserPaymentPlansRequests(request).postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPayment.id
        });

        const { transactionId, transactionStatus } = await test.step("Запрос на создание оплаты", async () => {
            const requestBody = await getPaymentCreateRequestJson(PaymentProvider.RECURRENT, paymentId, userId);
            const payment = (await (await new PaymentCreateRequests(request).postPaymentCreate(Statuses.OK, requestBody)).json()).transaction
            return {
                transactionId: payment.id,
                transactionStatus: payment.status
            }
        });

        const transactionData = await test.step("Запрос на получение транзакции", async () => {
            const transactionData = await new TransactionRequests(request).getTransaction(Statuses.OK, await getBaseParameters(), transactionId);
            return transactionData.json()
        });

        await test.step("Проверки", async () => {
            expect(transactionStatus).toEqual('completed');
            expect(transactionData.data[0].user_payment_plan_id).toEqual(paymentId);
            expect(transactionData.data[0].user.id).toEqual(userId);
        })
    });
});