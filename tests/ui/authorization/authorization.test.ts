import authCRMTestData from "@data/authCRM.json";
import test from "@tests/ui/baseTest.fixture";
import { setTimeout } from 'timers/promises';

test.describe("Тесты на авторизацию в CRM", async () => {
    test("Успешная авторизация в CRM", async ({ page, authPage, headerBlock }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.autorization(page, authCRMTestData.login, authCRMTestData.password);
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
            await authPage.autorization(page, authCRMTestData.login, authCRMTestData.password);
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

        await test.step("Нажать сбросить пароль и ввести емаил", async () => {
            await authPage.passwordReset(page, authCRMTestData.email)
        });

        await test.step("Проверить появления ошибки 'К сожалению, у вас нет разрешения на смену пароля'", async () => {
            await authPage.locators.forbidden(page).waitFor({ state: "visible", timeout: 3000 });
        });
    });

    test("Авторизация в CRM с невалидными данными", async ({ page, authPage }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.autorization(page, authCRMTestData.login, authCRMTestData.invalidPassword);
        });

        await test.step("Проверить что пользователь видит ошибку 'Неверный логин или пароль'", async () => {
            await authPage.locators.invalidCredentials(page).waitFor({ state: "visible", timeout: 3000 });
        });
    });
});