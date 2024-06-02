import { Locator, Page } from '@playwright/test';
export class Filter {
    locators = {
        applyButton: (page: Page): Locator => page.getByRole('button', { name: 'Применить' }),
        resetButton: (page: Page): Locator => page.locator("//*[text()='Сбросить']"),
        enterDate: (page: Page): Locator => page.getByPlaceholder("__.__.____")
    }
}