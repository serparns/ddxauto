import { expect, test } from "@playwright/test";
import api from "@api"
import authCRMTestData from "@data/authCRM.json"
import {getRandomEmail, getRandomPhoneNumber} from "@utils/random";
import ClubsRequests from "@requests/clubs.requests";
import {Statuses} from "@libs/statuses";
import {getBaseParameters} from "@entities/baseParameters";
import {getUserRequestJson} from "@entities/interface/user.requestJson";
import {SportExperience} from "@libs/sportExperience";
import userTestData from "@data/user.json";
import UsersRequests from "@requests/users.requests";

test.describe("Поиск нового клиента по номеру телефона", async () => {
    const userPhone = getRandomPhoneNumber()

    test.beforeAll( async ({ request }) => {
        const clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id
        });

        const userDataResponse = await test.step("Получить id клиента", async () => {
            const requestBody = await getUserRequestJson(clubId,
                getRandomEmail(),
                userPhone,
                SportExperience.FIVE_YEARS,
                userTestData.password);
            return (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data;
        });
    });
 /////////// Сделать нормальную проверку, попробовать использовать данные из респонса 

    test("Поиск по существующего клиента номеру телефона", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await page.getByPlaceholder("Логин").fill(authCRMTestData.login);
            await page.getByPlaceholder("Пароль").fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Войти' }).click();
        });

        await test.step("Ввести номер телефона, и проверить наличие кнопки 'Открыть'", async () => {
            await page.locator("//input[@data-testid='phone-input']").fill(userPhone);
            await page.locator("//div[@data-testid='search']").click();
            await page.locator("//div[text()='Открыть']").waitFor({ state: "visible" });
            await page.getByRole('button', { name: 'Открыть' }).click();
        });
    });

    test("Поиск по номеру телефона", async ({ page }) => {
        const userPhone = getRandomPhoneNumber();
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await page.getByPlaceholder("Логин").fill(authCRMTestData.login);
            await page.getByPlaceholder("Пароль").fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Войти' }).click();
        });

        await test.step("Ввести номер телефона, и перейти на страницу создания нового клиента", async () => {
            await page.locator("//input[@data-testid='phone-input']").fill(userPhone);
            await page.locator("//div[@data-testid='search']").click();
            await page.getByRole('button', { name: 'Создать' }).click();
        });

        await test.step("Проверить что пользователь находится на странице создания нового клиента", async () => {
            expect(page.url()).toContain(`add-client?phone=${userPhone.replace("+", "")}`);
        });

        await test.step("Проверить что номер в инпуте соответствуете валиден и соответствует ранее введенному номеру", async () => {
            expect(page.locator(`input[title="${userPhone.replace(/^\+(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+ $1 ($2) $3-$4-$5')}"]`)
                .waitFor({ state: "visible", timeout: 3000 }));
        });
    });
});