import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UserRequests from "@requests/user.requests";
import {getBaseParameters} from "@entities/baseParameters";
import ClubsRequests from "@requests/clubs.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import TransactionRequests from "@requests/transaction.requests";
import {Statuses} from "@libs/statuses";
import {PaymentProvider} from "@libs/providers";

test.describe("Api-тесты на регистрацию подписки пользователя", async () => {
    test("[positive] регистрация подписки", async ({request}) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });

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
                    home_club_id: clubId
                }
            }
            const createUser = (await (await new UserRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
            return createUser.id
        });

        const paymentId = await test.step("Отправить запрость на создание подписки", async () => {
            const requestBody = {
                club_id: clubId,
                start_date: "2024-11-29",
                payment_plan_id: 163,
                verification_token: "dfff78dc-5a27-4c85-9c77-f9d370d4fb2a",
                request_id: "123",
                session_id: "123",
                request_source: "123"
            }
            const userPayment = (await (await new UserPaymentPlansRequests(request).postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPayment.id
        });

        const {transactionId, transactionStatus} = await test.step("Запрос на создание оплаты", async () => {
            const requestBody = {
                session_id: "123",
                request_id: "123",
                request_source: "123",
                provider_id: PaymentProvider.RECURRENT,
                type: "payment",
                gate_id: 1,
                user_id: userId,
                user_payment_plan_id: paymentId,
                currency: "RUB",
                payment_service_id: 2,
                employee_id: 3134,
                fiscal_method: "OrangeData"
            }
            const payment = (await (await new PaymentCreateRequests(request).postPaymentCreate(Statuses.OK, requestBody)).json()).transaction
            return {
                transactionId: payment.id,
                transactionStatus: payment.status
            }
        });

        const transactionData = await test.step("Запрос на получение транзакции", async () => {
            const transactionData = await new TransactionRequests(request).getTransaction(Statuses.OK, await getBaseParameters(), transactionId);
            return transactionData.json()
        });

        await test.step("Проверки", async () => {
            expect(transactionStatus).toEqual('completed');
            expect(transactionData.data[0].user_payment_plan_id).toEqual(paymentId);
            expect(transactionData.data[0].user.id).toEqual(userId);
        })
    });
});