import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { expect, test } from "@playwright/test";
import { AuthPage } from "pages/auth.page";
import { HeaderBlock } from "pages/blocks/headers.blocks";
import { MenuBlock } from "pages/blocks/menu.blocks";
import { ClientsInClub } from "pages/clientsInClub.page";

test.describe("Тест на переход в клиенты в клубе", async () => {
    test("Успешная авторизация в CRM", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`);
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            new AuthPage().autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await new HeaderBlock().locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Проверить что пользователь находится на странице клиенты в клубе и видит фильтры", async () => {
            await new MenuBlock().locators.clientsInTheClub(page).click();
            expect(new ClientsInClub().locators.filters(page)).toBeVisible
        });
    });
});