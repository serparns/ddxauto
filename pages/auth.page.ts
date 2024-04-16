import { Locator, Page } from "@playwright/test";

export class AuthPage {
    locators = {
        loginInput: (page: Page): Locator => page.getByPlaceholder("Логин"),
        passwordInput: (page: Page): Locator => page.getByPlaceholder("Пароль"),
        enterButton: (page: Page): Locator => page.getByRole('button', { name: 'Войти' })
    }
    autorization = async (page: Page, login: string, password: string) => {
        await this.locators.loginInput(page).fill(login);
        await this.locators.passwordInput(page).fill(password);
        await this.locators.enterButton(page).click();
    }
}