import { Locator, Page } from "@playwright/test";

export class CloudPatmentPage {
    locators = {
        textPayProduct: (page: Page): Locator => page.locator("//*[text()='Оплата товаров']"),
        cardNumber: (page: Page): Locator => page.locator("//*[@id='card']"),
    }
} 