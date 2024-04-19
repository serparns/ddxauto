import { Locator, Page } from "@playwright/test";


export class Freeze {
    locator = {
        freeze: (page: Page): Locator => page.locator('//*[text()="Заморозки"]'),
        freezeRegistration: (page: Page): Locator => page.locator("//*[text()='Оформление заморозки']"),
        frostHistory: (page: Page): Locator => page.locator("//*[text()='История заморозок']"),
    }
}

export class TableOfContentsRegistrationFreeze {
    locator = {
        auth: (page: Page): Locator => page.locator("//*/a[@class][text()='Авторизация в CRM']"),
        search: (page: Page): Locator => page.locator("//*/a[@class][text()='Поиск клиента в CRM']"),
        freezing: (page: Page): Locator => page.locator("//*/a[@class][text()='Заморозка']"),
        pay: (page: Page): Locator => page.locator("//*/a[@class][text()='Оплата']"),
        moratorium: (page: Page): Locator => page.locator("//*/a[@class][text()='Заморозки в моратории']"),
    }
}