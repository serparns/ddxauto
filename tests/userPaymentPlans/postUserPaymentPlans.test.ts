import {expect, test} from "@playwright/test";
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import {getBaseParameters} from "@entities/baseParameters";
import ClubsRequests from "@requests/clubs.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import TransactionRequests from "@requests/transaction.requests";
import {Statuses} from "@libs/statuses";
import {PaymentProvider} from "@libs/providers";
import requestTestData from "@data/request.json"
import {RequestSource} from "@libs/requestSource";
import {SportExperience} from "@libs/sportExperience";
import userTestData from "@data/user.json";

test.describe("Api-тесты на регистрацию подписки пользователя", async () => {
    test("[positive] регистрация подписки", async ({request}) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });

        const userId = await test.step("Получить id клиента", async () => {
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

        const paymentId = await test.step("Отправить запрость на создание подписки", async () => {
            const requestBody = {
                club_id: clubId,
                start_date: "2024-11-29",
                payment_plan_id: 163,
                verification_token: "0429ed9c-6cc3-49e4-b90b-e489e60d3848",
                request_id: requestTestData.request_id,
                session_id: requestTestData.session_id,
                request_source: RequestSource.CRM,
            }
            const userPayment = (await (await new UserPaymentPlansRequests(request).postUserPaymentPlans(Statuses.OK, requestBody, userId)).json()).data[0]
            return userPayment.id
        });

        const {transactionId, transactionStatus} = await test.step("Запрос на создание оплаты", async () => {
            const requestBody = {
                session_id: requestTestData.session_id,
                request_id: requestTestData.request_id,
                request_source: RequestSource.CRM,
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