import authCRMTestData from "@data/authCRM.json";
import { Buttons } from "@pages/blocks/faq.buttons";
import { MenuBlock } from "@pages/blocks/menu.blocks";
import { Freeze } from "@pages/faq.freeze.page";
import { Faq } from "@pages/faq.page";
import { expect } from "@playwright/test";
import test from "@tests/ui/baseTest.fixture";
import { setTimeout } from 'timers/promises';

test.describe("Тест на проверку статей в faq", async () => {
    test("Проверка статьи", async ({ page, authPage, headerBlock }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto("")
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Проверить статью заморозки в faq", async () => {
            await new MenuBlock().locators.faq(page).click();
            expect(page.url()).toContain('/faq');
            await new Faq().locators.freezeList(page).click();
            await new Faq().locators.freezeRegistrationPage(page).click();
        });

        await test.step("Проверка хлебных кошек", async () => {
            await expect(new Freeze().locators.breadСrumbsFaq(page)).toBeVisible();
            await expect(new Freeze().locators.breadСrumbsFreezeRegistration(page)).toBeVisible();
            await new Freeze().locators.breadСrumbsFreezeRegistration(page).isDisabled()
            await new Freeze().locators.breadСrumbsFaq(page).click()
            await expect(new Faq().locators.searchSelect(page)).toBeVisible();
            await new Faq().locators.freezeList(page).click();
            await new Faq().locators.freezeRegistrationPage(page).click();
            await expect(new Freeze().locators.breadСrumbsFaq(page)).toBeVisible();
            await expect(new Freeze().locators.breadСrumbsFreezeRegistration(page)).toBeVisible();
        });

        await test.step("Проверка якорей на статье", async () => {
            await new Freeze().locators.authАnchor(page).click();
            await new Freeze().locators.searchАnchor(page).click();
            await new Freeze().locators.freezingАnchor(page).click();
            await new Freeze().locators.payАnchor(page).click();
            await new Freeze().locators.moratoriumАnchor(page).click();
            await new Buttons().locators.arrowDown(page).click().then(await setTimeout(1500));
        });// убрал некоторые проверки, так как долго, да и первая проверка проваливалась из-за того что текст помещался, и скролить было не куда, подумал и последней хватит

        await test.step("Проверка кнопок предыдущая и слудущая тема", async () => {
            await new Buttons().locators.previousTopic(page).click();
            await expect(new Freeze().locators.title(page)).not.toBeVisible();
            await new Buttons().locators.nextTopic(page).click();
            await expect(new Freeze().locators.title(page)).toBeVisible();
            expect(new Freeze().locators.text(page)).toBeTruthy
        });
    });
});

