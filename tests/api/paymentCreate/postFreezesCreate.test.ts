import requestTestData from "@data/request.json";
import { getBaseParameters } from "@entities/baseParameters";
import { getPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { getPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { RequestSource } from "@libs/requestSource";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getDate, getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Api-тесты на создание заморозки пользовательской подписки", async () => {
    let clubId: number;
    let userId: number;
    let userPaymentPlanId: number;

    const postFreezesResponse = async (request: APIRequestContext, status: Statuses, providerId: PaymentProvider) => {
        const requestBody = {
            gate_id: 6,
            is_technical: false,
            provider_id: providerId,
            user_id: userId,
            start_date: getDate(),
            end_date: "2024-09-26",
            user_payment_plan_id: userPaymentPlanId,
            payment_service_id: 2,
            products: [
                {
                    id: 116,
                    quantity: 1
                }
            ],
            currency: "RUB",
            employee_id: 4650,
            request_id: requestTestData.request_id,
            session_id: requestTestData.session_id,
            request_source: RequestSource.CRM,
        }
        return await new PaymentCreateRequests(request).postFreezesCreate(status, requestBody);
    }

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
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
        })
    })

    test("[positive] Создание заморозки", async ({ request }) => {
        const freezesCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => postFreezesResponse(request, Statuses.OK, PaymentProvider.FREEZES));

        await test.step("Проверки", async () => {
            expect((await freezesCreateSuccessResponse.json()).data[0].transaction.status).toEqual('in progress');
            expect((await freezesCreateSuccessResponse.json()).data[0].user_payment_plan.user_id).toEqual(userId);
        })
    });
});