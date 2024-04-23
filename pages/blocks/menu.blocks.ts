import { Locator, Page } from '@playwright/test';
export class MenuBlock {
    locators = {
        main: (page: Page): Locator => page.locator("//div/a[@href='/']"),
        schedule: (page: Page): Locator => page.locator("//div/a[@href='/schedule']"),
        discountsDictionary: (page: Page): Locator => page.locator("//div/a[@href='/discounts-dictionary']"),
        clubs: (page: Page): Locator => page.locator("//div/a[@href='/clubs']"),
        clientsInTheClub: (page: Page): Locator => page.locator("//div/a[@href='/clients-in-club']"),
        analytics: (page: Page): Locator => page.locator("//div/a[@href='/analytics']"),
        faq: (page: Page): Locator => page.locator("//div/a[@href='/faq']"),
    }
}