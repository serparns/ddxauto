import api from "@api";
import authCRMTestData from "@data/authCRM.json";
import subscribeStatusTestData from "@data/subscribeStatus.json";
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

        const { current, frozen, notStarted, paymentPending  } = await test.step("Получить информацию о подписке", async () => {
            return{
            current: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.current)).user_id,
            frozen: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.freezed)).user_id,
            notStarted: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.notStarted)).user_id,
            paymentPending: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.paymentPending)).user_id
            }
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`${api.urls.base_url_CRM}/client/${current}`)
            await page.locator("//div[text()='активный']").waitFor({ state: 'visible', timeout: 5000 });
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`${api.urls.base_url_CRM}/client/${frozen}`)
            await page.locator("//div[text()='заморожен']").waitFor({ state: 'visible', timeout: 5000 });
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`${api.urls.base_url_CRM}/client/${notStarted}`)
            await page.locator("//div[text()='не начат']").waitFor({ state: 'visible', timeout: 5000 });
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`${api.urls.base_url_CRM}/client/${paymentPending}`)
            await page.locator("//div[text()='мораторий']").waitFor({ state: 'visible', timeout: 5000 });
        });
    });
});