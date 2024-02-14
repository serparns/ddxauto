import {expect, test} from "@playwright/test";
import api from "@api"
import authCRMTestData from "@data/authCRM.json"
import { getRandomPhoneNumber } from "@utils/random";

test.describe("Поиск нового клиента по номеру телефона", async () => {
    test("Поиск по номеру телефона", async ({page}) =>{
        const userPhone = getRandomPhoneNumber();

       await test.step("Перейти на страницу входа", async ()  =>{
            await page.goto(`${api.urls.base_url_CRM}`)

        });
        await test.step("Заполнить форму авторизации и нажать зайти", async () =>{
            await page.getByPlaceholder("Логин").fill(authCRMTestData.login);
            await page.getByPlaceholder("Пароль").fill(authCRMTestData.password);
            await page.getByRole('button', {name: 'Войти'}).click();
        });

        await test.step("Ввести номер телефона, и перейти на страницу создания нового клиента", async () =>{
            await page.locator("//input[@data-testid='phone-input']").fill(userPhone);
            await page.locator("//div[@data-testid='search']").click();
            await page.getByRole('button', {name: 'Создать'}).click();

        });
        
        await test.step("Проверить что пользователь находится на странице создания нового клиента", async () =>{
            expect(page.url()).toContain(`add-client?phone=${userPhone.replace("+", "")}`);
        });
    });
});
