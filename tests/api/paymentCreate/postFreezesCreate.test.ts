import { postPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { getPaymentFreezingCreateRequestJson } from "@entities/interface/paymentFreezingCreate.requestJson";
import { postPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Api-тесты на создание заморозки пользовательской подписки", async () => {
    let userId: number;
    let userPaymentPlanId: number;

    const postFreezesResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            providerId?: PaymentProvider,
        }) => {
        const requestBody = await getPaymentFreezingCreateRequestJson(parameters.providerId, userPaymentPlanId, userId);
        return await new PaymentCreateRequests(request).postFreezesCreate(status, requestBody);
    };

    test.beforeAll(async ({ request, clubId }) => {
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

    test("[positive] Создание заморозки", async ({ request }) => {
        const freezesCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => postFreezesResponse(request, Statuses.OK, { providerId: PaymentProvider.FREEZES }));

        await test.step("Проверки", async () => {
            expect((await freezesCreateSuccessResponse.json()).data[0].transaction.status).toEqual('in progress');
            expect((await freezesCreateSuccessResponse.json()).data[0].user_payment_plan.user_id).toEqual(userId);
        });
    });
});