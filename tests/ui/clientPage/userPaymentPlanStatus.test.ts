import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import { selectUserPaymenPlanByStatus } from "@entities/db/userPaymentPlan.db";
import { test } from "@playwright/test";

test.describe("Проверка отображения статусов подписки на карточке клиента", async () => {
    test("Проветка отоброжения статуса Current ", async ({ page }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto(`${api.urls.base_url_CRM}`)
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await page.getByPlaceholder("Логин").fill(authCRMTestData.login);
            await page.getByPlaceholder("Пароль").fill(authCRMTestData.password);
            await page.getByRole('button', { name: 'Войти' }).click();
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await page.locator("//input[@data-testid='phone-input']").waitFor({ state: "visible", timeout: 3000 });
        });

        const userPaymentPlan = await test.step("Получить информацию о подписке в статусе Current", async () =>{
            return selectUserPaymenPlanByStatus('Current');
        }); 

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`${api.urls.base_url_CRM}/client/${userPaymentPlan.user_id}`)
            await page.locator("//div[text()='активный']").waitFor({state:'visible', timeout: 5000});
        });    
    });
});