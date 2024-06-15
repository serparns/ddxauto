import authCRMTestData from "@data/authCRM.json";
import { expect } from "@playwright/test";
import test from "../baseTest.fixture";

test.describe("Тест на навигацию по боковому меню", async () => {
    test("Успешный переход по всем ссылкам из меню", async ({
        page, authPage, headerBlock, menuBlock, discountPage, schedulePage, mainPage, clubsPage, analyticsPage, faq, clientsInClub
    }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto('')
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Проверить что пользователь находится на Главной странице, и видит текст 'Нужно найти клиента'", async () => {
            await menuBlock.locators.main(page).click();
            await mainPage.locators.neeToFindClient(page).waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/');
        });

        await test.step("Проверить что пользователь находится на странице расписание, и видит кнопку 'Добавить занятие'", async () => {
            await menuBlock.locators.schedule(page).click();;
            await schedulePage.locators.addAnActivity(page).waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/schedule');
        });

        await test.step("Проверить что пользователь находится на странице акций, и видит текст 'Доступные интерфейсы'", async () => {
            await menuBlock.locators.discountsDictionary(page).click();
            await discountPage.locators.selectInterfaces(page).waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/discounts-dictionary');
        });

        await test.step("Проверить что пользователь находится на странице клубов, и видит текст 'Clubs Page'", async () => {
            await menuBlock.locators.clubs(page).click();
            await clubsPage.locators.text(page).waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/clubs');
        });

        await test.step("Проверить что пользователь находится на странице клиенты в клубе и видит фильтры", async () => {
            await menuBlock.locators.clientsInTheClub(page).click();
            expect(clientsInClub.locators.applyButton(page)).toBeVisible
            expect.soft(page.url()).toContain('/clients-in-club');
        });

        await test.step("Проверить что пользователь находится на странице аналитика, и видит 'Фрейм аналитики'", async () => {
            await menuBlock.locators.analytics(page).click();
            await analyticsPage.locators.iframe(page).waitFor({ state: "visible", timeout: 3000 });
            expect.soft(page.url()).toContain('/analytics');
        });

        await test.step("Проверить что пользователь находится на странице FAQ", async () => {
            await menuBlock.locators.faq(page).click();
            await expect(faq.locators.searchSelect(page)).toBeVisible();
            expect.soft(page.url()).toContain('/faq');
        });
    });
});