import { baseDataJsonSchema } from "@entities/JsonSchema/base.response";
import { errorDataJsonSchema } from "@entities/JsonSchema/error.response";
import { paymentPlanV2Schema, userPaymentPlanV2PriceObjectSchema, userPaymentPlanV2TransactionsObjectSchema } from "@entities/JsonSchema/paymentCreate.response";
import { postPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { postV2PaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentPlan } from "@libs/paymentPlan";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import test, { expect } from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { validatorJson } from "@utils/validator";

test.describe("Api-тесты на создание платежа", async () => {
    let userResponseData: any;
    let userPaymentsPlans: any;

    const paymentCreateResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            providerId?: PaymentProvider,
            sessionId?: string,
            depositAmount?: number,
            userPaymentPlanId?: number
            childPlanId?: number
        }) => {
        const requestBody = await postPaymentCreateRequestJson(
            parameters.providerId, parameters.userPaymentPlanId, userResponseData.id, parameters.depositAmount, parameters.childPlanId);
        return await new PaymentCreateRequests(request).postV2PaymentCreate(status, requestBody);
    };

    test.beforeAll(async ({ request, clubId }) => {
        userResponseData = await test.step("Получить данные пользователя", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data;
        });

        await test.step("Запрос на создание подписок", async () => {
            userPaymentsPlans = await test.step("Запрос на создание подписок", async () => {
                const requestBody = await postV2PaymentPlanRequestJson(userResponseData.id, userResponseData.home_club_id, PaymentPlan.INFINITY);
                return (await (await new UserPaymentPlansRequests(request).postV2UserPaymentPlans(Statuses.OK, requestBody, userResponseData.id)).json()).data[0];
            });
        });
    });

    test("[positive] Создание платежа для двух подписок", async ({ request }) => {
        const response = (await (await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.OK, {
                providerId: PaymentProvider.ACTION_20, sessionId: "123", userPaymentPlanId: userPaymentsPlans.parent_id,
                childPlanId: userPaymentsPlans.id
            }))).json()).data[0];

        await test.step("Проверки", async () => {
            expect(response.transactions[0].status).toEqual('in progress');
            expect(response.transactions[1].status).toEqual('in progress');
            validatorJson(paymentPlanV2Schema, (response));
            validatorJson(userPaymentPlanV2TransactionsObjectSchema, (response.transactions[0]));
            validatorJson(userPaymentPlanV2PriceObjectSchema, (response.transactions[0].price));
        });
    });

    test("[negative] Создание платежа c провайдером отличным от (21 и 20)", async ({ request }) => {
        const response = (await (await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, {
                providerId: PaymentProvider.PAYMENT,
                userPaymentPlanId: userPaymentsPlans.parent_id,
                childPlanId: userPaymentsPlans.id
            }))).json());

        await test.step("Проверки", async () => {
            await validatorJson(errorDataJsonSchema, (response.error));
            await validatorJson(baseDataJsonSchema, (response));
            expect(await response.error.message).toEqual("wrong 'provider_id'");
        });
    });
});