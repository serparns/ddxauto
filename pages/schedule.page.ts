import { Locator, Page } from '@playwright/test';
export class SchedulePage {
    locators = {
        addAnActivity: (page: Page): Locator => page.getByRole('button', { name: 'Добавить занятие' })
    }
}