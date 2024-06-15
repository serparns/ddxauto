import { userClubObjectSchema, userPaymentPlanObjectSchema, userPaymentPlanSchema } from "@entities/JsonSchema/userPaymentPlan.response";
import { selectVerifyCode } from "@entities/db/userNotifications.db";
import { selectStatusFromUserPaymentPlan } from "@entities/db/userPaymentPlan.db";
import { postPaymentCreateRequestJson } from "@entities/interface/paymentCreate.requestJson";
import { postPaymentPlanRequestJson } from "@entities/interface/paymentPlan.requestJson";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { PostUserVerifyRequestJson, postVerifyGetCodeRequestJson } from "@entities/interface/verifyJson";
import { PaymentPlan } from "@libs/paymentPlan";
import { PaymentProvider } from "@libs/providers";
import { Statuses } from "@libs/statuses";
import { APIRequestContext } from "@playwright/test";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import UsersRequests from "@requests/users.requests";
import VerifyRequests from "@requests/verify.requests";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { validatorJson } from "@utils/validator";
import test, { expect } from "../baseTest.fixture";

test.describe("Api-тесты на смену подписки пользователю", async () => {
    let userPaymentPlanId: number;
    let userResponseData: any;
    let userVerifyCode: any;
    let userVerifyData: any;

    const postUserPaymentPlanChangeResponse = async (
        request: APIRequestContext,
        status: Statuses,
        clubId: number,
        parameters?: {
            userPaymentPlan?: number
        }) => {
        const requestBody = await postPaymentPlanRequestJson(clubId, parameters?.userPaymentPlan, userPaymentPlanId, userVerifyData.verification_token)
        return await new UserPaymentPlansRequests(request).postUserPaymentPlansChange(status, requestBody, userResponseData.id);
    };

    test.beforeAll(async ({ request, clubId }) => {
        userResponseData = await test.step("Получить данные пользователя", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });

        userPaymentPlanId = await test.step("Запрос на создание идентификатора пользовательского платежа", async () => {
            const requestBody = await postPaymentPlanRequestJson(clubId);
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userResponseData.id)).json()).data[0]
            return userPaymentPlanId.id
        });

        await test.step("Отправить запрос на получения кода верификации", async () => {
            const requestBody = await postVerifyGetCodeRequestJson(userResponseData.id, userResponseData.email);
            return await new VerifyRequests(request).postGetCode(Statuses.OK, requestBody);
        });

        userVerifyCode = await test.step("Получить код верификации", async () => {
            return (await selectVerifyCode(userResponseData.id))
        });

        userVerifyData = await test.step("Получения токена верификации", async () => {
            const code = JSON.parse(JSON.stringify(userVerifyCode)).code
            const requestBody = await PostUserVerifyRequestJson(userResponseData.id, userResponseData.email, code);
            return await (await new VerifyRequests(request).postUserVerify(Statuses.OK, requestBody)).json();
        });
    });

    test("Сменить пользователю подписку, и перевести ее статус в current ", async ({ request, clubId }) => {
        const userChangePaymentPlanData = (await (await test.step("запрос на смену подписки пользователю ",
            async () => postUserPaymentPlanChangeResponse(request, Statuses.OK, clubId, { userPaymentPlan: PaymentPlan.TRAINER }))).json()).data[0]

        await test.step("Смена подписки в статус current", async () => {
            const requestBody = await postPaymentCreateRequestJson(PaymentProvider.RECURRENT, userChangePaymentPlanData.id, userResponseData.id);
            return await new PaymentCreateRequests(request).postPaymentCreate(Statuses.OK, requestBody);
        });

        const { currentStatus, endedStatus } = await test.step("Получить статус подписки", async () => {
            return {
                currentStatus: (await selectStatusFromUserPaymentPlan(userChangePaymentPlanData.id)).status,
                endedStatus: (await selectStatusFromUserPaymentPlan(userPaymentPlanId)).status
            }
        });

        await test.step("Проверки", async () => {
            validatorJson(userPaymentPlanObjectSchema, (userChangePaymentPlanData.payment_plan));
            validatorJson(userClubObjectSchema, (userChangePaymentPlanData.club));
            validatorJson(userPaymentPlanSchema, (userChangePaymentPlanData));
            expect(userChangePaymentPlanData.user_id).toBe(userResponseData.id);
            expect(userChangePaymentPlanData.id).not.toBe(userPaymentPlanId);
            expect(currentStatus).toBe("Current");
            expect(endedStatus).toBe("Ended");
        });
    });
});