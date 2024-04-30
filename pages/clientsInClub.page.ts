import { Locator, Page } from "@playwright/test";


export class ClientsInClub {
    locators = {
        applyButton: (page: Page): Locator => page.getByRole('button', { name: 'Применить' })
    }
}