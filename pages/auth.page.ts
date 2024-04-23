import { Locator, Page } from "@playwright/test";

export class AuthPage {
    locators = {
        loginInput: (page: Page): Locator => page.getByPlaceholder("Логин"),
        passwordInput: (page: Page): Locator => page.getByPlaceholder("Пароль"),
        emailInput: (page: Page): Locator => page.getByPlaceholder("Email"),
        enterButton: (page: Page): Locator => page.getByRole('button', { name: 'Войти' }),
        reset: (page: Page): Locator => page.getByText("Не помню пароль"),
        resetPassword: (page: Page): Locator => page.getByRole('button', { name: 'Сбросить пароль' }),
        invalidCredentials: (page: Page): Locator => page.locator("//*[text()='Неверный логин или пароль']"),
        forbidden: (page: Page): Locator => page.getByText("К сожалению, у вас нет разрешения на смену пароля")
    }

    autorization = async (page: Page, login: string, password: string) => {
        await this.locators.loginInput(page).fill(login);
        await this.locators.passwordInput(page).fill(password);
        await this.locators.enterButton(page).click();
    }

    passwordReset = async (page: Page, email: string) => {
        await this.locators.reset(page).click();
        await this.locators.emailInput(page).fill(email);
        await this.locators.resetPassword(page).click();
    }
}