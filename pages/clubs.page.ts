import { Locator, Page } from '@playwright/test';
export class ClubsPage {
    locators = {
        text: (page: Page): Locator => page.getByText("Clubs Page")
    }
}