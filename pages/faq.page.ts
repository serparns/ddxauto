import { Locator, Page } from "@playwright/test";


export class Faq {
    breadСrumbs = {
        faq: (page: Page): Locator => page.locator("//div[@class][1][text()='FAQ']"),
        freezeRegistration: (page: Page): Locator => page.locator("//div[@class][3][text()='Оформление заморозки']")
    }
    input = {
        searchSelect: (page: Page): Locator => page.locator("//input[@data-testid='search-select']")
    }
}