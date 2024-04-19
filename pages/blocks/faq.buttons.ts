import { Locator, Page } from '@playwright/test';
export class Buttons {
    locators = {
        previousTopic: (page: Page): Locator => page.getByRole('button', { name: 'Предыдущая тема' }),
        nextTopic: (page: Page): Locator => page.getByRole('button', { name: 'Следующая' }),
        arrowDown: (page: Page): Locator => page.locator('//*[3]/button')
    }
}