import { Locator, Page } from "@playwright/test";


export class Freeze {
    locators = {
        text: (page: Page): Locator => page.locator('//p/../../*[@class][2]'),
        title: (page: Page): Locator => page.locator("//div[@class][1][text()='Оформление заморозки']"),
        authAnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Авторизация в CRM']"),
        searchAnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Поиск клиента в CRM']"),
        freezingAnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Заморозка']"),
        payAnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Оплата']"),
        moratoriumAnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Заморозки в моратории']"),
        breadCrumbsFaq: (page: Page): Locator => page.locator("//div[@class][1][text()='FAQ']"),
        breadCrumbsFreezeRegistration: (page: Page): Locator => page.locator("//div[@class][3][text()='Оформление заморозки']")
    }
}