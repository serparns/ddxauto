import { Locator, Page } from "@playwright/test";


export class ClientsInClub {
    locators = {
        filters: (page: Page): Locator => page.getByRole('button', { name: 'Фильтры' })
    }
}