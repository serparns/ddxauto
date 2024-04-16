import { Locator, Page } from '@playwright/test';
export class HeaderBlock {
    locators = {
        searchInput: (page: Page): Locator => page.locator("//input[@data-testid='phone-input']")
    }
}