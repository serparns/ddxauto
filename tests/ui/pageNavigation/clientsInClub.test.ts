import authCRMTestData from "@data/authCRM.json";
import { expect } from "@playwright/test";
import { setTimeout } from 'timers/promises';
import test from "../baseTest.fixture";

test.describe("Тест на переход в клиенты в клубе", async () => {
    test("Успешная авторизация в CRM", async ({ page, authPage, headerBlock, menuBlock, filter }) => {
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
            expect(filter.locators.applyButton(page)).toBeVisible().then(await setTimeout(5000))
        });

        await test.step("Проверить верстку страницы клиенты в клубе", async () => {
            await expect(page).toHaveScreenshot("noClientInClub.png", {
                fullPage: true,
                maxDiffPixelRatio: 0.02,
                mask: [
                    filter.locators.enterDate(page).nth(1),
                    filter.locators.enterDate(page).nth(0)
                ]
            });
        });

        await test.step("Поменять настройки экрана для показа кнопки 'Фильтры' открыть окно с фильтрами и проверить верстку", async () => {
            page.setViewportSize({ width: 1280, height: 720 });
            await filter.locators.filerButton(page).click()
            await expect(page).toHaveScreenshot("filterWindow.png", {
                fullPage: true,
                maxDiffPixelRatio: 0.02,
                mask: [
                    filter.locators.enterDate(page).nth(1),
                    filter.locators.enterDate(page).nth(0)
                ]
            });
        });

        await test.step("Открыть селектор выбора пола и проверить верстку", async () => {
            await filter.locators.select(page).click()
            await expect(page).toHaveScreenshot("filterWindowSexSelector.png", {
                fullPage: true,
                maxDiffPixelRatio: 0.02,
                mask: [
                    filter.locators.enterDate(page).nth(1),
                    filter.locators.enterDate(page).nth(0)
                ]
            });
        });
    });
});