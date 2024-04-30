import { Locator, Page } from '@playwright/test';
export class HeaderBlock {
    locators = {
        searchInput: (page: Page): Locator => page.getByTestId('phone-input'),
        searchButton: (page: Page): Locator => page.getByTestId('search'),
        createButton: (page: Page): Locator => page.getByRole('button', { name: 'Создать' }),
        openButton: (page: Page): Locator => page.getByRole('button', { name: 'Открыть' }),
    }

    oldUser = async (page: Page, userPhone: string) => {
        await this.locators.searchInput(page).fill(userPhone);
        await this.locators.searchButton(page).click();
        await this.locators.openButton(page).waitFor({ state: "visible" });
    }

    newUser = async (page: Page, newUserPhone: string) => {
        await this.locators.searchInput(page).fill(newUserPhone);
        await this.locators.searchButton(page).click();
        await this.locators.createButton(page).click();
    }
}