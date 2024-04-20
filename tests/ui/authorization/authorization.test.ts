import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { test } from "@playwright/test";
import { AuthPage } from "pages/auth.page";
import { HeaderBlock } from "pages/blocks/headers.blocks";
import { setTimeout } from 'timers/promises';

test.describe("Тесты на авторизацию в CRM", async () => {
    test("Успешная авторизация в CRM", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await new AuthPage().autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await new HeaderBlock().locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });
    });

    test("Проверка вывода ошибки при попытке сбросить пароль", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`).then(await setTimeout(1500));
        });

        await test.step("Нажать сбросить пароль и ввести емаил", async () => {
            await new AuthPage().passwordReset(page, authCRMTestData.email)
        });

        await test.step("Проверить появления ошибки 'К сожалению, у вас нет разрешения на смену пароля'", async () => {
            await new AuthPage().error.forbidden(page).waitFor({ state: "visible", timeout: 3000 });
        });
    });

    test("Авторизация в CRM с невалидными даннымы", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await new AuthPage().autorization(page, authCRMTestData.login, authCRMTestData.invalidPassword);
        });

        await test.step("Проверить что пользователь видит ошибку 'Неверный логин или пароль'", async () => {
            await new AuthPage().error.invalidCredentials(page).waitFor({ state: "visible", timeout: 3000 });
        });
    });
});