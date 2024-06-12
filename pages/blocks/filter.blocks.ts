import { Locator, Page } from '@playwright/test';
export class Filter {
    locators = {
        filerButton: (page: Page): Locator => page.getByRole('button', { name: 'Фильтры' }),
        searchSelect: (page: Page): Locator => page.getByTestId('search-select'),
        select: (page: Page): Locator => page.getByTestId('select'),
        applyButton: (page: Page): Locator => page.getByRole('button', { name: 'Применить' }),
        resetButton: (page: Page): Locator => page.locator("//*[text()='Сбросить']"),
        enterDate: (page: Page): Locator => page.getByPlaceholder("__.__.____")
    }
}