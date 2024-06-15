import { postPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { postPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import test, { expect } from "../baseTest.fixture";

test.describe("Api-тесты на создание платежа", async () => {
    let userId: number;
    let userPaymentPlanId: number;

    const paymentCreateResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            providerId?: PaymentProvider,
            depositAmount?: number,
            userPaymentPlanId?: number
            childPlanId?: number
        }) => {
        const requestBody = await postPaymentCreateRequestJson(parameters.providerId, parameters.userPaymentPlanId, userId, parameters.depositAmount);
        return await new PaymentCreateRequests(request).postPaymentCreate(status, requestBody);
    };

    test.beforeEach(async ({ request, clubId }) => {
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
    });

    test("[positive] Создание платежа", async ({ request }) => {
        const paymentCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.OK, {
                providerId: PaymentProvider.RECURRENT,
                userPaymentPlanId: userPaymentPlanId
            }));


        await test.step("Проверки", async () => {
            expect((await paymentCreateSuccessResponse.json()).transaction.status).toEqual('completed');
        });
    });

    test("[positive] Пополнение депозита", async ({ request }) => {
        const paymentCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.OK, {
                providerId: PaymentProvider.DEPOSIT, depositAmount: 100
            }));

        await test.step("Проверки", async () => {
            expect((await paymentCreateSuccessResponse.json()).transaction.status).toEqual('in progress');
            expect((await paymentCreateSuccessResponse.json()).transaction.price.deposit_amount).toEqual(100);
        });
    });

    test("[negative] создание платежа, без провайдера", async ({ request }) => {
        const paymentCreateErrorResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, {
                userPaymentPlanId: userPaymentPlanId
            }));

        await test.step("Проверки", async () => {
            expect((await paymentCreateErrorResponse.json()).error.message).toEqual("not payment provider");
        });
    });
});