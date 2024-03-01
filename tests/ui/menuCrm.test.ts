import {expect, test} from "@playwright/test";
import api from "@api"
import authCRMTestData from "@data/authCRM.json"

test.describe("Тест на навигацию по боковому меню", async () => {
    test("Успешный переход по всем ссылкам из меню", async ({ page }) => {
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
        await test.step("Проверить что пользователь находится на Главной странице, и видит текст 'Нужно найти клиента'", async () => {
            await page.locator("//div/a[@href='/']").click();
            await page.getByText("Нужно найти клиента").waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/');
        });

        await test.step("Проверить что пользователь находится на странице расписание, и видит кнопку 'Добавить занятие'", async () => {
            await page.locator("//div/a[@href='/schedule']").click();
            await page.getByRole('button', { name: 'Добавить занятие' }).waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/schedule');
        });

        await test.step("Проверить что пользователь находится на странице акций, и видит текст 'Доступные интерфейсы'", async () => {
            await page.locator("//div/a[@href='/discounts-dictionary']").click();
            await page.getByText("Доступные интерфейсы").waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/discounts-dictionary');
        });

        await test.step("Проверить что пользователь находится на странице клубы, и видит текст 'Clubs Page'", async () => {
            await page.locator("//div/a[@href='/clubs']").click();
            await page.getByText("Clubs Page").waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/clubs');
        });

        await test.step("Проверить что пользователь находится на странице клиенты в клубе и видит фильтры", async () => {
            await page.locator("//div/a[@href='/clients-in-club']").click();
            await page.getByRole('button', { name: 'Фильтры' }).waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/clients-in-club');
        });

        await test.step("Проверить что пользователь находится на странице аналитика, и видит 'Фрейм аналитики'", async () => {
            await page.locator("//div/a[@href='/analytics']").click();
            await page.locator("//iframe").waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/analytics');
        });

        await test.step("Проверить что пользователь находится на странице FAQ", async () => {
            await page.locator("//div/a[@href='/faq']").click();
            await page.locator("//input[@data-testid='search-select']").waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/faq');
        });
    });

});