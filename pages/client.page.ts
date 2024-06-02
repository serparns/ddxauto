import { Locator, Page } from "@playwright/test";

export class ClientPage {
    locators = {
        blockButton: (page: Page): Locator => page.getByRole('button', { name: 'Заблокировать' }),
        enterBlockNoteText: (page: Page): Locator => page.getByPlaceholder("Введите текст блокирующей заметки"),
        unLockButton: (page: Page): Locator => page.getByRole('button', { name: 'Разблокировать' }),
        noteBlock: (page: Page): Locator => page.locator("//*[text()='block']"),
        userEmail: (page: Page, userData: any): Locator => page.locator(`//*[text()="Email"]/../div[2][@class][text()="${userData.email}"]`),
        userPhone: (page: Page, userData: any): Locator => page.locator(`//*[text()="Телефон"]/../div[2][@class][text()="${userData.phone}"]`),
        userSportExperience: (page: Page, userData: any): Locator => page.locator(`//*[text()="Опыт в фитнесе"]/../div[2][@class][text()="${userData.sport_experience}"]`),
        userBirthday: (page: Page, birthday: any): Locator => page.locator(`//*[text()="День рождения"]/../div[2][@class][contains(text(),"${birthday}")]`),
        userSex: (page: Page, userData: any): Locator => page.locator(`//div[@title='${userData.sex}']`),
        noSubscribe: (page: Page): Locator => page.locator("//div[text()='Нет активных подписок']"),
        registeredSubscribe: (page: Page): Locator => page.locator("//div[text()='зарегистрирован']"),
        currentSubscribe: (page: Page): Locator => page.locator("//div[text()='активный']"),
        frozenSubscribe: (page: Page): Locator => page.locator("//div[text()='заморожен']"),
        notStartedSubscribe: (page: Page): Locator => page.locator("//div[text()='не начат']"),
        paymentPendingSubscribe: (page: Page): Locator => page.locator("//div[text()='мораторий']"),
        noBracelet: (page: Page): Locator => page.locator("//span[text()='Нет привязанного браслета']"),
        noBrowsingHistory: (page: Page): Locator => page.locator("//div[text()='Нет истории посещений']"),
        noActiveEntrySmartStart: (page: Page): Locator => page.locator("//*[text()='Smart Start']/../div[1]//*[text()='Нет активной записи']"),
        noActiveEntryTraining: (page: Page): Locator => page.locator("//*[text()='Нет активных записей']"),
        activeEntryGroupTraining: (page: Page, groupTrainingName: string): Locator => page.locator(`//*[text()='${groupTrainingName}']`),
        openAllTransaction: (page: Page): Locator => page.locator("//div[text()='Открыть все записи']"),
        breadCrumbsClient: (page: Page): Locator => page.locator("//*[text()='Клиент']")
    };
};