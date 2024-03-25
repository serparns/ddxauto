import { getBaseParameters } from "@entities/baseParameters";
import { getPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { getPaymentFreezingCreateRequestJson } from "@entities/interface/paymentFreezingCreate.requestJson";
import { getPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import TransactionRequests from "@requests/transaction.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Api-тесты на получение транзакций пользователя", async () => {
    let clubId: number;
    let userId: number;
    let userPaymentPlanId: number;


    const transactionResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters?: {
            user?: number

        }) => {
        const params = async (): Promise<object> => {
            let params = await getBaseParameters()
            if (parameters?.user != undefined) params = { ...params, ...{ user_id: parameters.user } }
            return params;
        }
        return await new TransactionRequests(request).getTransactionUser(status, await params());
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

        await test.step("Создание заморозки", async () => {
            const requestBody = await getPaymentFreezingCreateRequestJson(PaymentProvider.FREEZES, userPaymentPlanId, userId);
            return await new PaymentCreateRequests(request).postFreezesCreate(Statuses.OK, requestBody);
        })
    })

    test("Получение списка транзакций пользователя", async ({ request }) => {
        await test.step("Получение акций",
            async () => transactionResponse(request, Statuses.OK, { user: userId }))
    });
});