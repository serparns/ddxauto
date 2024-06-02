import { Locator, Page } from "@playwright/test";

export class PaymentInformationPage {
    locators = {
        transactionId: (page: Page, userTransaction: number): Locator => page.getByRole('cell', { name: `${userTransaction}` }),
        countUsersTransactions: (page: Page, countTransaction: number): Locator => page.locator(`//*[contains(text(),'из ${countTransaction}')]`),
        breadCrumbsTransactionHistory: (page: Page): Locator => page.locator("//*[text()='История платёжных операций']"),
        tabsPayment: (page: Page): Locator => page.locator("//*[text()='Оплата']"),
        tabsRefund: (page: Page): Locator => page.locator("//*[text()='Возврат']")
    };
};