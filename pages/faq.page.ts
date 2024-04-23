import { Locator, Page } from "@playwright/test";

export class Faq {
    locators = {
        freezeList: (page: Page): Locator => page.locator('//*[text()="Заморозки"]'),
        freezeRegistrationPage: (page: Page): Locator => page.locator("//*[text()='Оформление заморозки']"),
        frostHistoryPage: (page: Page): Locator => page.locator("//*[text()='История заморозок']"),
        searchSelect: (page: Page): Locator => page.getByTestId('search-select')
    }
}