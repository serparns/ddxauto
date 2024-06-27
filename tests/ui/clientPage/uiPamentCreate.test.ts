import authCRMTestData from "@data/authCRM.json";
import cardTestData from '@data/cardData.json';
import { selectClubShortName } from "@entities/db/clubs.db";
import { selectVerifyCode } from "@entities/db/userNotifications.db";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { setTimeout } from 'timers/promises';
import paths from '../../../api.json';
import test, { expect } from "../baseTest.fixture";

test.describe("Тест на оплату подписки пользователя", async () => {
    const paymentServices = [
        { serviceId: cardTestData.cloud.service },
        { serviceId: cardTestData.sber.service }
    ];

    paymentServices.forEach(paymentService => {
        test(`Создание подписки для нового пользователя с payment_service_id ${paymentService.serviceId}`,
            async ({ page, authPage, headerBlock, createUserPage, context, cloudPaymentPage, sberPaymentPage, clientPage }) => {
                const newUserPhone = getRandomPhoneNumber();
                const email = getRandomEmail();
                let paymentUrl;
                let userVerifyCode;
                let clubName;
                let userId;
                let transactionId;

                page.on('response', async req => {
                    if (req.url().includes(paths.paths.payment_create)) {
                        paymentUrl = (await req.json()).transaction.payment_widget_uri
                    }

                    if (req.url().includes(paths.paths.user_payment_plans)) {
                        userId = (await req.json()).data[0].user_id
                    }

                    if (req.url().includes(paths.paths.transaction_status)) {
                        transactionId = (await req.json()).transaction.id
                    }
                });

                clubName = await test.step(`Получить имя клуба у которого payment_service_id = ${paymentService.serviceId} `, async () => {
                    return (await selectClubShortName(paymentService.serviceId)).short_name
                });

                await test.step("Авторизоваться, и начать создания нового пользователя, заполнить блок 'Информация о клиенте'", async () => {
                    await page.goto('')
                    await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
                    await headerBlock.newUser(page, newUserPhone)
                    expect(page.url()).toContain(`add-client?phone=${newUserPhone.replace("+", "")}`);
                    await createUserPage.enterUserData(page, email);
                });

                await test.step("Заполнить данные в 'Подписке'", async () => {
                    await createUserPage.locators.select(page).nth(1).click();
                    await createUserPage.locators.selectSubscribe(page).click();
                    await createUserPage.locators.choiceClub(page).fill(clubName);
                    await createUserPage.locators.choiceClub(page).press('Enter');
                });

                await test.step("Нажать на кнопку отправки формы регистрации и проверить что появилась кнопка подтверждения", async () => {
                    await createUserPage.locators.sendButton(page).nth(0).click();
                    await expect(createUserPage.locators.confirmButton(page)).toBeVisible();
                });

                userVerifyCode = await test.step("Получить код верификации", async () => {
                    return (await selectVerifyCode(email))
                });

                await test.step("Вставить код верификации и нажать подтвердить", async () => {
                    const code = JSON.parse(JSON.stringify(userVerifyCode)).code
                    await createUserPage.locators.confirmForme(page).fill(code);
                    await createUserPage.locators.confirmButton(page).click();
                });

                await test.step("Отправить ссылку на оплату", async () => {
                    await createUserPage.locators.select(page).nth(2).click();
                    await createUserPage.locators.sendButton(page).click();
                    await createUserPage.locators.waitingForPayment(page).waitFor({ state: "visible", timeout: 5000 });
                });

                await test.step("Открыть отплату в новой вкладке", async () => {
                    const newTab = await context.newPage().then(await setTimeout(1000));
                    await newTab.goto(paymentUrl);
                    if (newTab.url().includes('/sbersafe_sberid/')) {
                        await sberPaymentPage.successfulPayment(
                            newTab, cardTestData.sber.number.visa, cardTestData.sber.date, cardTestData.sber.cvv, cardTestData.sber.confirm);
                    } else {
                        await cloudPaymentPage.successfulPayment(
                            newTab, cardTestData.cloud.number.mir, cardTestData.cloud.date, cardTestData.cloud.cvv)
                    }
                    await newTab.waitForURL(`${paths.urls.site}${transactionId}`)
                    await newTab.close().then(await setTimeout(1000));
                });

                await test.step(`Проверить что оплата  произошла успешно, закрыть вкладку с оплатой, 
                    и проверить что при нажатии кнопки "Завершить оформление" происходит переход на карточку клиента где user_id = ${userId} `, async () => {
                    await createUserPage.locators.waitingForPayment(page).isHidden();
                    await createUserPage.locators.continueButton(page).click();
                    await createUserPage.locators.completeRegistration(page).click();
                    await page.url().includes(`/client/${userId}`);
                });

                await test.step("проверить  что есть плашка со статусом Current", async () => {
                    await expect(clientPage.locators.currentPlanScreenshot(page)).toHaveScreenshot("currentPlanScreenshot.png", {
                        maxDiffPixelRatio: 0.02
                    });
                });
            });
    })
})