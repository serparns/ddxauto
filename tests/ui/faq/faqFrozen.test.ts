import authCRMTestData from "@data/authCRM.json";
import { expect } from '@playwright/test';
import test from "@tests/ui/baseTest.fixture";
import { setTimeout } from 'timers/promises';

test.describe("Тест на проверку статей в faq", async () => {
    test("Проверка статьи", async ({ page, authPage, headerBlock, freeze, menuBlock, faq, buttons }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Проверить статью заморозки в faq", async () => {
            await menuBlock.locators.faq(page).click();
            expect(page.url()).toContain('/faq');
            await faq.locators.freezeList(page).click();
            await faq.locators.freezeRegistrationPage(page).click();
        });

        await test.step("Проверка хлебных кошек", async () => {
            await expect(freeze.locators.breadCrumbsFaq(page)).toBeVisible();
            await expect(freeze.locators.breadCrumbsFreezeRegistration(page)).toBeVisible();
            await freeze.locators.breadCrumbsFreezeRegistration(page).isDisabled()
            await freeze.locators.breadCrumbsFaq(page).click()
            await expect(faq.locators.searchSelect(page)).toBeVisible();
            await faq.locators.freezeList(page).click();
            await faq.locators.freezeRegistrationPage(page).click();
            await expect(freeze.locators.breadCrumbsFaq(page)).toBeVisible();
            await expect(freeze.locators.breadCrumbsFreezeRegistration(page)).toBeVisible();
        });

        await test.step("Проверка якорей на статье", async () => {
            await freeze.locators.authAnchor(page).click();
            await freeze.locators.searchAnchor(page).click();
            await freeze.locators.freezingAnchor(page).click();
            await freeze.locators.payAnchor(page).click();
            await freeze.locators.moratoriumAnchor(page).click();
            await buttons.locators.arrowDown(page).click().then(await setTimeout(1500));
        });

        await test.step("Проверка кнопок предыдущая и следующая тема", async () => {
            await buttons.locators.previousTopic(page).click();
            await expect(freeze.locators.title(page)).not.toBeVisible();
            await buttons.locators.nextTopic(page).click();
            await expect(freeze.locators.title(page)).toBeVisible();
            expect(freeze.locators.text(page)).toBeTruthy
        });
    });
});

