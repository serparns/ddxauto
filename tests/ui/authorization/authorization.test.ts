import authCRMTestData from "@data/authCRM.json";
import { expect } from "@playwright/test";
import { setTimeout } from 'timers/promises';
import test from "../baseTest.fixture";


test.describe("Тесты на авторизацию в CRM", async () => {
    test("Успешная авторизация в CRM", async ({ page, authPage, headerBlock }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Проверить верстку страницы авторизации", async () => {
            await expect(page).toHaveScreenshot("authPage.png", {
                fullPage: true,
                maxDiffPixelRatio: 0.02,
                mask: [
                    authPage.locators.passwordInput(page)
                ]
            });
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });
    });

    test("Проверка сохранения авторизационных данных", async ({ page, authPage, headerBlock, context }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        const newTab = await test.step("Открыть новую вкладку и проверить что пользователь авторизован", async () => {
            const newTab = await context.newPage();
            await newTab.goto("");
            return newTab;
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(newTab).waitFor({ state: "visible", timeout: 5000 });
        });

    });

    test("Проверка вывода ошибки при попытке сбросить пароль", async ({ page, authPage }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("").then(await setTimeout(1500));
        });

        await test.step("Нажать сбросить пароль и ввести email", async () => {
            await authPage.passwordReset(page, authCRMTestData.email);
        });

        await test.step("Проверить появление ошибки 'К сожалению, у вас нет разрешения на смену пароля'", async () => {
            await authPage.locators.forbidden(page).waitFor({ state: "visible", timeout: 3000 });
        });
    });

    test("Авторизация в CRM с невалидными данными", async ({ page, authPage }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.invalidPassword);
        });

        await test.step("Проверить что пользователь видит ошибку 'Неверный логин или пароль'", async () => {
            await authPage.locators.invalidCredentials(page).waitFor({ state: "visible", timeout: 3000 });
        });
    });
});