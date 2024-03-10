import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { expect, test } from "@playwright/test";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Создание нового пользователя", async () => {
    test("Создание ного пользователя", async ({ page }) => {
        const userPhone = getRandomPhoneNumber();
        const email = getRandomEmail();

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

        await test.step("Заполнить форму регистрации данными  в блоке 'ИНФОРМАЦИЯ О КЛИЕНТЕ'", async () => {
            await page.getByPlaceholder("Введите имя").fill('QatestAuto');
            await page.getByPlaceholder("Введите фамилию").fill('QatestAuto');
            await page.getByPlaceholder("Введите email").fill(email);
            await page.locator("//*[text()='Выберите интервал']").click();
            await page.locator("//*[@title='6-12 месяцев']").click();
            await page.locator("//*[@type='radio'][@name='sex'][@value='male']/..").click()
            await page.getByPlaceholder("__.__.____").nth(0).fill("12121999")
        });

        await test.step("Заполнить форму регистрации данными  в блоке 'ИНФОРМАЦИЯ О ПОДПИСКЕ'", async () => {
            await page.locator("//*[text()='Выберите тариф']").click();
            await page.locator("//*[@title='Infinity 1мес']").click();
            await page.getByPlaceholder("Выберите клуб").click();
            await page.locator("//*[@title='DDX София']").click();
        });

        await test.step("Нажать на кнопку отправки формы регистрации и проверить что появилась кнопка подтверждения", async () => {
            await page.locator("//*[text()='Отправить']").nth(0).click();
            await expect(page.getByRole('button', { name: 'Подтвердить' })).toBeVisible();
        });
    });
});