import { Locator, Page } from '@playwright/test';
export class ShedulePage {
    locators = {
        addAnActivity: (page: Page): Locator => page.getByRole('button', { name: 'Добавить занятие' })
    }
}