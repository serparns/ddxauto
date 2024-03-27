import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { test } from "@playwright/test";

test.describe("Тест на переход в клиенты в клубе", async () => {
    test("Успешная авторизация в CRM", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`);
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await page.getByPlaceholder("Логин").fill(authCRMTestData.login);
            await page.getByPlaceholder("Пароль").fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Войти' }).click();
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await page.locator("//input[@data-testid='phone-input']").waitFor({ state: "visible", timeout: 3000 });
        });

        await test.step("Проверить что пользователь находится на странице клиенты в клубе и видит фильтры", async () => {
            await page.locator("//div/a[@href='/clients-in-club']").click();
            await page.getByRole('button', { name: 'Фильтры' }).waitFor({ state: "visible", timeout: 3000 });
        });
    });
});