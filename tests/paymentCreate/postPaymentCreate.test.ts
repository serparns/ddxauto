import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UserRequests from "@requests/user.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import {Statuses} from "@libs/statuses";
import {PaymentProvider} from "@libs/providers";

test.describe("Api-тесты на создание платежа", async () => {
    test("[positive] создание платежа", async ({request}) => {

        const userId = await test.step("Получить id клиента", async () => {
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
                    home_club_id: 17
                }
            }
            const createUser = (await (await new UserRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        const userPaymentPlanId = await test.step("Запрос на получение идентификатора пользовательского платежа", async () => {
            const requestBody = {
                club_id: 17,
                start_date: "2024-11-29",
                payment_plan_id: 163,
                verification_token: "dfff78dc-5a27-4c85-9c77-f9d370d4fb2a",
                request_id: "123",
                session_id: "123",
                request_source: "123"
            }
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id
        });

        const payment = await test.step("Запрос на создание оплаты", async () => {
            const requestBody = {
                session_id: "123",
                request_id: "123",
                request_source: "123",
                provider_id: PaymentProvider.RECURRENT,
                type: "payment",
                gate_id: 1,
                user_id: userId,
                user_payment_plan_id: userPaymentPlanId,
                currency: "RUB",
                payment_service_id: 2,
                employee_id: 3134,
                fiscal_method: "OrangeData"
            }
            const payment = (await (await new PaymentCreateRequests(request).postPaymentCreate(Statuses.OK, requestBody)).json())
            return payment.transaction
        });


        await test.step("Проверки", async () => {
            expect(payment.status).toEqual('completed');
        })
    });

    test("[negative] создание платежа без обязательных параметров", async ({request}) => {

        const userId = await test.step("Получить id клиента", async () => {
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
                    home_club_id: 17
                }
            }
            const createUser = (await (await new UserRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        const userPaymentPlanId = await test.step("Запрос на получение идентификатора пользовательского платежа", async () => {
            const requestBody = {
                club_id: 17,
                start_date: "2024-11-29",
                payment_plan_id: 163,
                verification_token: "dfff78dc-5a27-4c85-9c77-f9d370d4fb2a",
                request_id: "123",
                session_id: "123",
                request_source: "123"
            }
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id
        });

        const payment = await test.step("Запрос на создание оплаты", async () => {
            const requestBody = {
                provider_id: PaymentProvider.RECURRENT,
                type: "payment",
                gate_id: 1,
                user_id: userId,
                user_payment_plan_id: userPaymentPlanId,
                currency: "RUB",
                payment_service_id: 2,
                employee_id: 3134,
                fiscal_method: "OrangeData"
            }
            const payment = (await (await new PaymentCreateRequests(request).postPaymentCreate(Statuses.BAD_REQUEST, requestBody)).json())
            return payment.error
        });

        await test.step("Проверки", async () => {
            expect(payment.message).toEqual('API session_id required');
        })
    });

    test("[negative] создание платежа, без провайдера", async ({request}) => {
        const userId = await test.step("Получить id клиента", async () => {
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
                    home_club_id: 17
                }
            }
            const createUser = (await (await new UserRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        const userPaymentPlanId = await test.step("Отправить запрость на создание подписки", async () => {
            const requestBody = {
                club_id: 17,
                start_date: "2024-11-29",
                payment_plan_id: 163,
                verification_token: "dfff78dc-5a27-4c85-9c77-f9d370d4fb2a",
                request_id: "123",
                session_id: "123",
                request_source: "123"
            }
            const userPaymentPlanId = (await (await new UserPaymentPlansRequests(request)
                .postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPaymentPlanId.id
        });

        const payment = await test.step("Запрос на создание оплаты", async () => {
            const requestBody = {
                session_id: "123",
                request_id: "123",
                request_source: "123",
                type: "payment",
                gate_id: 1,
                user_id: userId,
                user_payment_plan_id: userPaymentPlanId,
                currency: "RUB",
                payment_service_id: 2,
                employee_id: 3134,
                fiscal_method: "OrangeData"
            }
            const payment = (await (await new PaymentCreateRequests(request).postPaymentCreate(Statuses.BAD_REQUEST, requestBody)).json())
            return payment.error
        });

        await test.step("Проверки", async () => {
            expect(payment.message).toEqual("not payment provider");
        })
    })
});
