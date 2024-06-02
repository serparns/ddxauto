import authCRMTestData from "@data/authCRM.json";
import { selectTransaction, selectUserIdByTransaction } from "@entities/db/transactions.db";
import test from "@tests/ui/baseTest.fixture";

test.describe("Переход на страницу транзакций пользователя", async () => {
    test("Получение транзакций пользователя", async ({ page, authPage, headerBlock, paymentInformationPage: paymentInformationPage, clientPage, filter }) => {
        let userId: number

        await test.step("Перейти на страницу входа", async () => {
            await page.goto('')
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Проверить что пользователь находится в CRM и видит поле поиска", async () => {
            await headerBlock.locators.searchInput(page).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Найти пользователя с транзакциями и перейти на страницу данного пользователя", async () => {
            userId = (await test.step("Получить id пользователя", async () => { return (await selectUserIdByTransaction()) })).user_id
            await page.goto(`/client/${userId}`)
        });

        await test.step("Нажать на кнопку все транзакции, проверить id и количество транзакций которое отображается", async () => {
            const transactionId = (await test.step("Получить транзакции пользователя", async () => { return (await (selectTransaction(userId))) }));
            await clientPage.locators.openAllTransaction(page).nth(1).click();
            await paymentInformationPage.locators.countUsersTransactions(page, transactionId.length).waitFor({ state: "visible", timeout: 5000 });
            await paymentInformationPage.locators.transactionId(page, transactionId[0].id).waitFor({ state: "visible", timeout: 5000 });
        });

        await test.step("Дополнительные проверки на наличия хлебных крошек, табов и фильтра", async () => {
            await clientPage.locators.breadCrumbsClient(page).isVisible();
            await paymentInformationPage.locators.breadCrumbsTransactionHistory(page).isVisible();
            await paymentInformationPage.locators.tabsPayment(page).isVisible();
            await filter.locators.applyButton(page).isVisible();
            await filter.locators.resetButton(page).isVisible();
            await filter.locators.enterDate(page).nth(0).isVisible();
            await filter.locators.enterDate(page).nth(1).isVisible();

        });
    });
}); 