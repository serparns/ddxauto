import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { expect, test } from "@playwright/test";
import { AuthPage } from "pages/auth.page";
import { Buttons } from "pages/blocks/faq.buttons";
import { HeaderBlock } from "pages/blocks/headers.blocks";
import { MenuBlock } from "pages/blocks/menu.blocks";
import { Freeze, TableOfContentsRegistrationFreeze } from "pages/faq.freeze.page";
import { Faq } from "pages/faq.page";
import { setTimeout } from 'timers/promises';

test.describe("Тест на проверку статей в faq", async () => {
    test("Проверка статьи", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`);
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            new AuthPage().autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await new HeaderBlock().locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Проверить статью заморозки в faq", async () => {
            await new MenuBlock().locator.faq(page).click();
            expect(page.url()).toContain('/faq');
            await new Freeze().locator.freeze(page).click();
            await new Freeze().locator.freezeRegistration(page).click();
        });

        await test.step("Проверка хлебных кошек", async () => {
            await expect(new Faq().breadСrumbs.faq(page)).toBeVisible();
            await expect(new Faq().breadСrumbs.freezeRegistration(page)).toBeVisible();
            await new Faq().breadСrumbs.freezeRegistration(page).isDisabled() // типо проверка на то что нельзя нажать
            await new Faq().breadСrumbs.faq(page).click()
            await expect(new Faq().input.searchSelect(page)).toBeVisible();
            await new Freeze().locator.freeze(page).click();
            await new Freeze().locator.freezeRegistration(page).click();
            await expect(new Faq().breadСrumbs.faq(page)).toBeVisible();
            await expect(new Faq().breadСrumbs.freezeRegistration(page)).toBeVisible();
        });

        await test.step("Проверка якорей на статье", async () => { // тут происходит проверка, что при нажатии на якорь появляется кнопка
            await new TableOfContentsRegistrationFreeze().locator.auth(page).click();
            await new Buttons().locators.arrowDown(page).click().then(await setTimeout(1500));
            await new TableOfContentsRegistrationFreeze().locator.search(page).click();
            await new Buttons().locators.arrowDown(page).click().then(await setTimeout(1500));
            await new TableOfContentsRegistrationFreeze().locator.freezing(page).click();
            await new Buttons().locators.arrowDown(page).click().then(await setTimeout(1500));
            await new TableOfContentsRegistrationFreeze().locator.pay(page).click();
            await new Buttons().locators.arrowDown(page).click().then(await setTimeout(1500));
            await new TableOfContentsRegistrationFreeze().locator.moratorium(page).click();
            await new Buttons().locators.arrowDown(page).click().then(await setTimeout(1500));
        });// таймаут нужен для того чтобы страница перед следующим якорем успела вернуться в нормальное состояние

        await test.step("Проверка кнопок предыдущая и слудущая тема", async () => {
            await new Buttons().locators.previousTopic(page).click();
            await expect(new Freeze().locator.title(page)).not.toBeVisible();
            await new Buttons().locators.nextTopic(page).click();
            await expect(new Freeze().locator.title(page)).toBeVisible();
            expect(new Freeze().locator.text(page)).toBeTruthy
        });
    });
});

