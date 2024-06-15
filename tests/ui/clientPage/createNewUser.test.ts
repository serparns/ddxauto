import authCRMTestData from "@data/authCRM.json";
import { expect } from "@playwright/test";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import test from "../baseTest.fixture";

test.describe("Создание нового пользователя", async () => {
    test("Создание нового пользователя", async ({ page, authPage, headerBlock, createUserPage }) => {
        const newUserPhone = getRandomPhoneNumber();
        const email = getRandomEmail();

        await test.step("Перейти на страницу входа", async () => {
            await page.goto('')
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Ввести номер телефона, и перейти на страницу создания нового клиента", async () => {
            await headerBlock.newUser(page, newUserPhone)
        });

        await test.step("Проверить что пользователь находится на странице создания нового клиента", async () => {
            expect(page.url()).toContain(`add-client?phone=${newUserPhone.replace("+", "")}`);
        });

        await test.step("Проверить верстку на странице создания клиента когда нет данных", async () => {
            await expect(page).toHaveScreenshot("createUserPageNoData.png", {
                fullPage: true,
                maxDiffPixelRatio: 0.02,
                mask: [
                    createUserPage.locators.userPhone(page, newUserPhone)
                ]
            })
        });

        await test.step("Проверить что номер в инпуте соответствуете валиден и соответствует ранее введенному номеру", async () => {
            await expect(createUserPage.locators.userPhone(page, newUserPhone)).toBeVisible();
        });

        await test.step("Заполнить форму регистрации данными  в блоке 'ИНФОРМАЦИЯ О КЛИЕНТЕ'", async () => {
            await createUserPage.enterUserData(page, email);
        });

        await test.step("Заполнить форму регистрации данными  в блоке 'ИНФОРМАЦИЯ О ПОДПИСКЕ'", async () => {
            await createUserPage.enterSubscribeData(page);
        });

        await test.step("Проверить верстку на странице создания клиента когда данные заполнены", async () => {
            await expect(page).toHaveScreenshot("createUserPageFullData.png", {
                fullPage: true,
                maxDiffPixelRatio: 0.02,
                mask: [
                    createUserPage.locators.userPhone(page, newUserPhone)
                ]
            })
        });

        await test.step("Нажать на кнопку отправки формы регистрации и проверить что появилась кнопка подтверждения", async () => {
            await createUserPage.locators.sendButton(page).nth(0).click();
            await expect(createUserPage.locators.confirmButton(page)).toBeVisible();
        });
    });
}); 