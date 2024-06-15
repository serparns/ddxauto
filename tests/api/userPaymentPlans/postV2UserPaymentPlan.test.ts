import { userClubObjectSchema, userPaymentPlanObjectSchema, userPaymentPlanSchema } from "@entities/JsonSchema/userPaymentPlan.response";
import { postV2PaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PaymentPlan } from "@libs/paymentPlan";
import { Statuses } from "@libs/statuses";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { validatorJson } from "@utils/validator";
import test, { expect } from "../baseTest.fixture";

test.describe("Api-тесты на создание двух  подписок пользователю", async () => {
    let userResponseData: any;

    test.beforeAll(async ({ request, clubId }) => {
        userResponseData = await test.step("Получить данные пользователя", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data;
        });
    });

    test("Создание подписки пользователю action + fitness", async ({ request }) => {
        const userPaymentsPlans = await test.step("Запрос на создание подписок", async () => {
            const requestBody = await postV2PaymentPlanRequestJson(userResponseData.id, userResponseData.home_club_id, PaymentPlan.INFINITY)
            return (await (await new UserPaymentPlansRequests(request).postV2UserPaymentPlans(Statuses.OK, requestBody, userResponseData.id)).json()).data;
        });

        await test.step("Проверки", async () => {
            expect(userPaymentsPlans.length).toBe(2);
            expect(userPaymentsPlans[0].parent_id).toBe(userPaymentsPlans[1].id);
            validatorJson(userPaymentPlanSchema, (userPaymentsPlans[0]));
            validatorJson(userPaymentPlanObjectSchema, (userPaymentsPlans[0].payment_plan));
            validatorJson(userClubObjectSchema, (userPaymentsPlans[0].club));
        });
    });
});