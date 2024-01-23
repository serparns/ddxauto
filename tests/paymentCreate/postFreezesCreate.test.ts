import {APIRequestContext, expect, test} from "@playwright/test";
import {getDate, getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import UsersRequests from "@requests/users.requests";
import UserPaymentPlansRequests from "@requests/userPaymentPlans.requests";
import PaymentCreateRequests from "@requests/paymentCreate.requests";
import {Statuses} from "@libs/statuses";
import {PaymentProvider} from "@libs/providers";
import ClubsRequests from "@requests/clubs.requests";
import {getBaseParameters} from "@entities/baseParameters";

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
            request_id: "123",
            session_id: "2",
            request_source: "123"
        }
        return await new PaymentCreateRequests(request).postFreezesCreate(status, requestBody);
    }

    test.beforeAll(async ({request}) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });
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
                start_date: getDate(),
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

        await test.step("Создание подписки", async () => {
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
            return await new PaymentCreateRequests(request).postPaymentCreate(Statuses.OK, requestBody);
        })
    })

    test("[positive] Создание заморозки", async ({request}) => {
        const freezesCreateSuccessResponse = await test.step("Запрос на создание оплаты",
            async () => postFreezesResponse(request, Statuses.OK, PaymentProvider.FREEZES));

        await test.step("Проверки", async () => {
            expect((await freezesCreateSuccessResponse.json()).data[0].transaction.status).toEqual('in progress');
            expect((await freezesCreateSuccessResponse.json()).data[0].user_payment_plan.user_id).toEqual(userId);
        })
    });
});