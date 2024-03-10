import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { getBaseParameters } from "@entities/baseParameters";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { Statuses } from "@libs/statuses";
import { expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import UsersRequests from "@requests/users.requests";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Поиск нового клиента по номеру телефона", async () => {
    const userPhone = getRandomPhoneNumber()
    let userData: any;
    let clubId: number;

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id;
        });

        userData = await test.step("создать пользователя и получить данные о нем", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), userPhone);
            return userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    })

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
        });

        await test.step("Открыть страницу пользователя, и проверить id на соответствие", async () => {
            await page.getByRole('button', { name: 'Открыть' }).click();
            expect(page.url()).toContain(`client/${userData.id}`);
        });

        let birthday = userData.birthday.split('-').reverse().join('.');
        
        await test.step("Софтовые проверки 'Блок клиент'" , async () => {
            await expect.soft(page.locator(`//*[text()="Email"]/../div[2][@class][text()="${userData.email}"]`)).toBeVisible();
            await expect.soft(page.locator(`//*[text()="Телефон"]/../div[2][@class][text()="${userData.phone}"]`)).toBeVisible();
            await expect.soft(page.locator(`//*[text()="Опыт в фитнесе"]/../div[2][@class][text()="${userData.sport_experience}"]`)).toBeVisible();
            await expect.soft(page.locator(`//*[text()="День рождения"]/../div[2][@class][contains(text(),"${birthday}")]`)).toBeVisible();
            await expect.soft(page.locator(`//div[@title='${userData.sex}']`)).toBeVisible();

        });

        await test.step("Софтовые проверки 'Информация за пределами блока клиентских данных'", async () => {
            await expect.soft(page.locator("//div[text()='Нет активных подписок']")).toBeVisible();
            await expect.soft(page.locator("//span[text()='Нет привязанного браслета']")).toBeVisible();
            await expect.soft(page.locator("//div[text()='Нет истории посещений']")).toBeVisible();
            await expect.soft(page.locator(`//*[text()="Smart Start"]/../div[1]//*[text()='Нет активной записи']`)).toBeVisible();
            await expect.soft(page.locator(`//*[text()="Запись на групповые"]/../div[1]//*[text()='Нет активной записи']`)).toBeVisible();
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
            await expect(page.locator(`input[title="${userPhone.replace(/^\+(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+ $1 ($2) $3-$4-$5')}"]`)).toBeVisible();
        });
    });
});