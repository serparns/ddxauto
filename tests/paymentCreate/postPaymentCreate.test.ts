import {APIRequestContext, expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import {Statuses} from "@libs/statuses";
import {PaymentProvider} from "@libs/providers";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";

test.describe("Api-тесты на создание платежа", async () => {

    let clubId: number;
    let userId: number;
    let userPaymentPlanId: number;

    const paymentCreateResponse = async (request: APIRequestContext, status: Statuses, providerId: PaymentProvider | null,
                                         sessionId: string | null, depositAmount: number | null, userPaymentPlanId: number | null) => {
        const requestBody = {
            session_id: sessionId,
            request_id: "123",
            request_source: "123",
            provider_id: providerId,
            deposit_amount: depositAmount,
            type: "payment",
            gate_id: 1,
            user_id: userId,
            user_payment_plan_id: userPaymentPlanId,
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
                session_id: "123",
                request_id: "321",
                request_source: "crm",
                data: {
                    email: getRandomEmail(),
                    name: "Test",
                    last_name: "Test",
                    middle_name: "",
                    sex: "male",
                    phone: getRandomPhoneNumber(),
                    birthday: "1999-11-11",
                    password: "qwerty123",
                    lang: "ru",
                    club_access: true,
                    admin_panel_access: true,
                    group_training_registration_access: true,
                    sport_experience: "Нет опыта",
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
                request_id: "123",
                session_id: "123",
                request_source: "123"
            }
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id
        });

    })

    test("[positive] Создание платежа", async ({request}) => {

        const paymentCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.OK, PaymentProvider.RECURRENT, "123", null, userPaymentPlanId));


        await test.step("Проверки", async () => {
            expect((await paymentCreateSuccessResponse.json()).transaction.status).toEqual('completed');
        })
    });

    test("[positive] Пополение депозита", async ({request}) => {

        const paymentCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.OK, PaymentProvider.DEPOSIT, "123", 100, null));


        await test.step("Проверки", async () => {
            expect((await paymentCreateSuccessResponse.json()).transaction.status).toEqual('in progress');
            expect((await paymentCreateSuccessResponse.json()).transaction.price.deposit_amount).toEqual(100);
        })
    });

    test("[negative] создание платежа без обязательных параметров", async ({request}) => {
        const paymentCreateErrorResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, PaymentProvider.RECURRENT, null, null, userPaymentPlanId));

        await test.step("Проверки", async () => {
            expect((await paymentCreateErrorResponse.json()).error.message).toEqual('API session_id required');
        })
    });

    test("[negative] создание платежа, без провайдера", async ({request}) => {
        const paymentCreateErrorResponse = await test.step("Запрос на создание оплаты",
            async () => paymentCreateResponse(request, Statuses.BAD_REQUEST, null, "123", null, userPaymentPlanId));

        await test.step("Проверки", async () => {
            expect((await paymentCreateErrorResponse.json()).error.message).toEqual("not payment provider");
        })
    })
});
