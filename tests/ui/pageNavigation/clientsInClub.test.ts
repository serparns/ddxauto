import authCRMTestData from "@data/authCRM.json";
import { expect } from "@playwright/test";
import test from "@tests/ui/baseTest.fixture";

test.describe("Тест на переход в клиенты в клубе", async () => {
    test("Успешная авторизация в CRM", async ({ page, authPage, headerBlock, menuBlock, clientsInClub }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Проверить что пользователь находится на странице клиенты в клубе и видит фильтры", async () => {
            await menuBlock.locators.clientsInTheClub(page).click();
            await expect(clientsInClub.locators.applyButton(page)).toBeVisible
        });
    });
});