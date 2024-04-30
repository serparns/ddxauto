import { Locator, Page } from '@playwright/test';
export class AnalyticsPage {
    locators = {
        iframe: (page: Page): Locator => page.locator("//iframe")
    }
}