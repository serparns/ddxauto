import { Locator, Page } from "@playwright/test";
import { setTimeout } from 'timers/promises';

export class SberPaymentPage {
    locators = {
        inputCardNumber: (page: Page): Locator => page.locator("//*[@id='pan']"),
        inputCardDate: (page: Page): Locator => page.locator("//*[@id='expiry']"),
        inputCardCvv: (page: Page): Locator => page.locator("//*[@id='cvc']"),
        submitButton: (page: Page): Locator => page.locator('[data-test-id="submit-payment"]'),
        inputPassword: (page: Page): Locator => page.locator("//*[@id='password']"),
        successButton: (page: Page): Locator => page.locator("//button[@data-test-id='submit-payment']"),
    }

    successfulPayment = async (page: Page, cardNumber: string, cardDate: string, cardCvv: string, password: string) => {
        await this.locators.inputCardNumber(page).fill(cardNumber);
        await this.locators.inputCardDate(page).fill(cardDate);
        await this.locators.inputCardCvv(page).fill(cardCvv);
        await this.locators.submitButton(page).click();
        await this.locators.inputPassword(page).fill(password).then(await setTimeout(1500));
        await this.locators.inputPassword(page).press('Enter');
    }
} 