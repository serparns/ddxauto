import { Locator, Page } from "@playwright/test";
import { setTimeout } from 'timers/promises';

export class CloudPatmentPage {
    locators = {
        inputCardNumber: (page: Page): Locator => page.frameLocator('iframe').locator('//*[@id="card"]'),
        inputCardDate: (page: Page): Locator => page.frameLocator('iframe').locator('//*[@id="date"]'),
        inputCardCvv: (page: Page): Locator => page.frameLocator('iframe').locator('//*[@id="cvv"]'),
        submitButton: (page: Page): Locator => page.frameLocator('iframe').locator('[type="submit"]'),
        successButton: (page: Page): Locator => page.frameLocator('iframe').frameLocator('iframe').locator('//button/div[text()="Успех"]'),
    }// TODO поразбираться на будующее как красиво писать пейджи для iframe, особенно когда его писал Xzibit

    successfulPayment = async (page: Page, cardNumber: string, cardDate: string, cardCvv: string) => {
        await this.locators.inputCardNumber(page).fill(cardNumber);
        await this.locators.inputCardDate(page).fill(cardDate);
        await this.locators.inputCardCvv(page).fill(cardCvv);
        await this.locators.submitButton(page).click().then(await setTimeout(3000));
        await this.locators.successButton(page).click().then(await setTimeout(3000));
    }
} 