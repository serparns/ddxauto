import { Locator, Page } from "@playwright/test";

export class CreateUserPage {
    locators = {

        userPhone: (page: Page, newUserPhone: any): Locator => page.locator(`input[title="${newUserPhone.replace(/^\+(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+ $1 ($2) $3-$4-$5')}"]`),
        enterName: (page: Page): Locator => page.getByPlaceholder("Введите имя"),
        enterLastName: (page: Page): Locator => page.getByPlaceholder("Введите фамилию"),
        enterEmail: (page: Page): Locator => page.getByPlaceholder("Введите email"),
        select: (page: Page): Locator => page.getByTestId('select'),
        searchSelect: (page: Page): Locator => page.getByTestId('search-select'),
        selectFitnessExperience: (page: Page): Locator => page.locator("//*[@title='6-12 месяцев']"),
        selectSex: (page: Page): Locator => page.locator("//*[@type='radio'][@name='sex'][@value='male']/.."),
        enterBirthday: (page: Page): Locator => page.getByPlaceholder("__.__.____"),
        selectSubscribe: (page: Page): Locator => page.locator("//*[@title='Infinity 1мес']"),
        selectClub: (page: Page): Locator => page.locator("//*[@title='DDX София']"),
        sendButton: (page: Page): Locator => page.getByRole('button', { name: 'Отправить' }),
        confirmButton: (page: Page): Locator => page.getByRole('button', { name: 'Подтвердить' }),
    }
    enterUserData = async (page: Page, email: string) => {
        await this.locators.enterName(page).fill('QatestAuto');
        await this.locators.enterLastName(page).fill('QatestAuto');
        await this.locators.enterEmail(page).fill(email);
        await this.locators.select(page).nth(0).click();
        await this.locators.selectFitnessExperience(page).click();
        await this.locators.selectSex(page).click()
        await this.locators.enterBirthday(page).nth(0).fill("12121999")
    }

    enterSubscribeData = async (page: Page) => {
        await this.locators.select(page).nth(1).click();
        await this.locators.selectSubscribe(page).click();
        await this.locators.searchSelect(page).nth(0).click();
        await this.locators.selectClub(page).click();
    }
}