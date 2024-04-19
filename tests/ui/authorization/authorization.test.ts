import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { test } from "@playwright/test";
import { AuthPage } from "pages/auth.page";
import { HeaderBlock } from "pages/blocks/headers.blocks";

test.describe("Тесты на авторизацию в CRM", async () => {
    test("Успешная авторизация в CRM", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            new AuthPage().autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await new HeaderBlock().locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });
    });

    test("Проверка вывода ошибки при попытке сбросить пароль", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`);
        });

        await test.step("Нажать сбросить пароль и ввести емаил", async () => {
            await page.getByText("Не помню пароль").click()
            await page.getByPlaceholder("Email").fill(authCRMTestData.email);
            await page.getByRole('button', { name: 'Сбросить пароль' }).click();
        });

        await test.step("Проверить появления ошибки 'К сожалению, у вас нет разрешения на смену пароля'", async () => {
            await page.getByText("К сожалению, у вас нет разрешения на смену пароля").waitFor({ state: "visible", timeout: 3000 });
        });
    });

    test("Авторизация в CRM с невалидными даннымы", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            new AuthPage().autorization(page, authCRMTestData.login, authCRMTestData.invalidPassword);
        });

        await test.step("Проверить что пользователь видит ошибку 'Неверный логин или пароль'", async () => {
            await page.locator("//*[text()='Неверный логин или пароль']").waitFor({ state: "visible", timeout: 5000 });
        });
    });
});