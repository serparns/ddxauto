import { Locator, Page } from "@playwright/test";

export class Faq {
    locators = {
        searchSelect: (page: Page): Locator => page.getByTestId('search-select')
    }
}