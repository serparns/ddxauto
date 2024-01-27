import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import {Statuses} from "@libs/statuses";
import {PaymentProvider} from "@libs/providers";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";
import requestTestData from "@data/request.json"
import {RequestSource} from "@libs/requestSource";
import {SportExperience} from "@libs/sportExperience";
import userTestData from "@data/user.json";

test.describe("Api-тесты на создание платежа", async () => {
    let clubId: number;
    let userId: number;
    let userPaymentPlanId: number;

    const paymentCreateResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters: {
            providerId?: PaymentProvider,
            sessionId?: string,
            depositAmount?: number,
            userPaymentPlanId?: number
        }) => {
        const requestBody = {
            session_id: parameters.sessionId,
            request_id: requestTestData.request_id,
            request_source: RequestSource.CRM,
            provider_id: parameters.providerId,
            deposit_amount: parameters.depositAmount,
            type: "payment",
            gate_id: 1,
            user_id: userId,
            user_payment_plan_id: parameters.userPaymentPlanId,
            currency: "RUB",
            payment_service_id: 2,
            employee_id: 3134,
            fiscal_method: "OrangeData"
        }
        return await new PaymentCreateRequests(request).postPaymentCreate(status, requestBody);
    }

    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });
    })

    test.beforeEach(async ({request}) => {
        userId = await test.step("Получить id клиента", async () => {
            const requestBody = {
                session_id: requestTestData.session_id,
                request_id: requestTestData.request_id,
                request_source: RequestSource.CRM,
                data: {
                    email: getRandomEmail(),
                    name: getRandomName(),
                    last_name: userTestData.last_name,
                    middle_name: userTestData.middle_name,
                    sex: userTestData.sex.male,
                    phone: getRandomPhoneNumber(),
                    birthday: userTestData.birthday,
                    password: userTestData.password,
                    lang: userTestData.lang,
                    sport_experience: SportExperience.FIVE_YEARS,
                    home_club_id: clubId
                }
            }
            const createUser = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });
        userPaymentPlanId = await test.step("Запрос на получение идентификатора пользовательского платежа", async () => {
            const requestBody = {
                club_id: clubId,
                start_date: "2024-11-29",
                payment_plan_id: 163,
                verification_token: "0429ed9c-6cc3-49e4-b90b-e489e60d3848",
                request_id: requestTestData.request_id,
                session_id: requestTestData.session_id,
                request_source: RequestSource.CRM,
            }
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id
        });
    })

    test("[positive] Создание платежа", async ({request}) => {
        const paymentCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.OK, {
                providerId: PaymentProvider.RECURRENT,
                sessionId: "123", userPaymentPlanId: userPaymentPlanId
            }));


        await test.step("Проверки", async () => {
            expect((await paymentCreateSuccessResponse.json()).transaction.status).toEqual('completed');
        })
    });

    test("[positive] Пополение депозита", async ({request}) => {
        const paymentCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.OK, {
                providerId: PaymentProvider.DEPOSIT,
                sessionId: "123", depositAmount: 100
            }));

        await test.step("Проверки", async () => {
            expect((await paymentCreateSuccessResponse.json()).transaction.status).toEqual('in progress');
            expect((await paymentCreateSuccessResponse.json()).transaction.price.deposit_amount).toEqual(100);
        })
    });

    test("[negative] создание платежа без обязательных параметров", async ({request}) => {
        const paymentCreateErrorResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, {
                providerId: PaymentProvider.RECURRENT,
                userPaymentPlanId: userPaymentPlanId
            }));

        await test.step("Проверки", async () => {
            expect((await paymentCreateErrorResponse.json()).error.message).toEqual('API session_id required');
        })
    });

    test("[negative] создание платежа, без провайдера", async ({request}) => {
        const paymentCreateErrorResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, {
                sessionId: "123",
                userPaymentPlanId: userPaymentPlanId
            }));

        await test.step("Проверки", async () => {
            expect((await paymentCreateErrorResponse.json()).error.message).toEqual("not payment provider");
        })
    })
});