import authCRMTestData from "@data/authCRM.json";
import subscribeStatusTestData from "@data/subscribeStatus.json";
import { selectUserPaymenPlanByStatus } from "@entities/db/userPaymentPlan.db";
import test from "@tests/ui/baseTest.fixture";

test.describe("Проверка отображения статусов подписки на карточке клиента", async () => {
    test("Проверка отображения статусов подписки", async ({ page, authPage, headerBlock, clientPage }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto('')
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        const { current, frozen, notStarted, paymentPending } = await test.step("Получить информацию о подписке", async () => {
            return {
                current: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.current)).user_id,
                frozen: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.freezed)).user_id,
                notStarted: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.notStarted)).user_id,
                paymentPending: (await selectUserPaymenPlanByStatus(subscribeStatusTestData.statuses.paymentPending)).user_id
            }
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`/client/${current}`)
            await clientPage.locators.currentSubscribe(page).waitFor({ state: 'visible', timeout: 4000 });
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`/client/${frozen}`)
            await clientPage.locators.frozenSubscribe(page).waitFor({ state: 'visible', timeout: 4000 });
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`/client/${notStarted}`)
            await clientPage.locators.notStartedSubscribe(page).waitFor({ state: 'visible', timeout: 4000 });
        });

        await test.step("Перейти на страницу клиента и проверить отображение корректного статуса", async () => {
            await page.goto(`/client/${paymentPending}`)
            await clientPage.locators.paymentPendingSubscribe(page).waitFor({ state: 'visible', timeout: 4000 });
        });
    });
});