import { Locator, Page } from "@playwright/test";


export class Freeze {
    locators = {
        text: (page: Page): Locator => page.locator('//p/../../*[@class][2]'),
        title: (page: Page): Locator => page.locator("//div[@class][1][text()='Оформление заморозки']"),
        authАnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Авторизация в CRM']"),
        searchАnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Поиск клиента в CRM']"),
        freezingАnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Заморозка']"),
        payАnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Оплата']"),
        moratoriumАnchor: (page: Page): Locator => page.locator("//*/a[@class][text()='Заморозки в моратории']"),
        breadСrumbsFaq: (page: Page): Locator => page.locator("//div[@class][1][text()='FAQ']"),
        breadСrumbsFreezeRegistration: (page: Page): Locator => page.locator("//div[@class][3][text()='Оформление заморозки']")
    }
}