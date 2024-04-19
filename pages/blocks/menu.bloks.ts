import { Locator, Page } from '@playwright/test';
export class MenuBlock {
    locator = {
        faq: (page: Page): Locator => page.locator("//div/a[@href='/faq']")
    }
}