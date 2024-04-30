import { Locator, Page } from '@playwright/test';
export class DiscountPage {
    locators = {
        selectInterfaces: (page: Page): Locator => page.getByText("Выберите интерфейсы")
    }
}