import { expect, test } from "@playwright/test";
import api from "@api"
import authCRMTestData from "@data/authCRM.json"
import {getRandomEmail, getRandomName, getRandomPhoneNumber} from "@utils/random";

test.describe("Создание нового пользователя и проверка информации о созданном пользователе", async () => {
    test("Поиск по номеру телефона", async ({ page }) => {
        const userPhone = getRandomPhoneNumber();
        const email = getRandomEmail();
        const name = getRandomName();

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

        await test.step("Заполнить форму регистрации данными  и нажать зайти отправить письмо", async () => {
            await page.getByPlaceholder("Введите имя").fill(name);
            await page.getByPlaceholder("Введите фамилию").fill(name);
            await page.getByPlaceholder("Введите email").fill(email);
        }); //TODO сделать тесты на добавления данных, и запилить проверки
    });
});
