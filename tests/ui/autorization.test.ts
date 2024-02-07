import {test} from "@playwright/test";
import api from "@api"
import authCRMTestData from "@data/authCRM.json"

test.describe("Тесты на авторизацию в CRM", async () => {
    test("Успешная авторизация в CRM", async ({page}) =>{
       await test.step("Перейти на страницу входа", async ()  =>{
            await page.goto(`${api.urls.base_url_CRM}`)


        });
        await test.step("Заполнить форму авторизации и нажать зайти", async () =>{
            await page.getByPlaceholder("Логин").waitFor({state: "visible", timeout: 3000});
            await page.getByPlaceholder("Логин").fill(authCRMTestData.login);
            await page.getByPlaceholder("Пароль").fill(authCRMTestData.password);
            await page.getByRole('button', {name: 'Войти'}).click();
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () =>{
            await page.locator("//input[@data-testid='phone-input']").waitFor({state: "visible", timeout: 3000});
        });
    });

    test("Проверка вывода ошибки при попытке сбросить пароль", async ({page}) =>{
        await test.step("Перейти на страницу входа", async ()  =>{
            await page.goto(`${api.urls.base_url_CRM}`);

        });
        await test.step("Нажать сбросить пароль и ввсести емаил", async () =>{
            await page.getByText("Не помню пароль").click()
            await page.getByPlaceholder("Email").fill(authCRMTestData.email);
            await page.getByRole('button', {name: 'Сбросить пароль'}).click();
            await page.getByRole('button', {name: 'Сбросить пароль'}).waitFor({state: "visible", timeout: 3000});
        });

        await test.step("Проверить что появилась ошибка", async () =>{
            await page.getByText("К сожалению, у вас нет разрешения на смену пароля").waitFor({state: "visible", timeout: 3000});
        });
    });
});
