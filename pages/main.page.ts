import { Locator, Page } from '@playwright/test';
export class MainPage {
    locators = {
        neeToFindClient: (page: Page): Locator => page.getByText("Нужно найти клиента")
    }
}