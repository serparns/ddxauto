import authCRMTestData from "@data/authCRM.json";
import { getBaseParameters } from "@entities/baseParameters";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { Statuses } from "@libs/statuses";
import { expect } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import UsersRequests from "@requests/users.requests";
import test from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Поиск нового клиента по номеру телефона", async () => {
    const userPhone = getRandomPhoneNumber()
    let userData: any;
    let clubId: number;

    test.beforeAll(async ({ request }) => {
        clubId = await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id;
        });

        userData = await test.step("создать пользователя и получить данные о нем", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), userPhone);
            return userData = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data
        });
    })

    test("Поиск по существующего клиента номеру телефона", async ({ page, authPage, headerBlock, clientPage }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto('')
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Ввести номер телефона, и проверить наличие кнопки 'Открыть'", async () => {
            await headerBlock.oldUser(page, userPhone)
        });

        await test.step("Открыть страницу пользователя, и проверить id на соответствие", async () => {
            await headerBlock.locators.openButton(page).click();
            expect(page.url()).toContain(`client/${userData.id}`);
        });

        let birthday = userData.birthday.split('-').reverse().join('.');

        await test.step("Софтовые проверки 'Блок клиент'", async () => {
            await expect.soft(clientPage.locators.userEmail(page, userData)).toBeVisible();
            await expect.soft(clientPage.locators.userPhone(page, userData)).toBeVisible();
            await expect.soft(clientPage.locators.userSportExperience(page, userData)).toBeVisible();
            await expect.soft(clientPage.locators.userbirthday(page, birthday)).toBeVisible();
            await expect.soft(clientPage.locators.userSex(page, userData)).toBeVisible();

        });

        await test.step("Софтовые проверки 'Информация за пределами блока клиентских данных'", async () => {
            await expect.soft(clientPage.locators.noSubscribe(page)).toBeVisible();
            await expect.soft(clientPage.locators.noBracelet(page)).toBeVisible();
            await expect.soft(clientPage.locators.noBrowsingGistory(page)).toBeVisible();
            await expect.soft(clientPage.locators.noActiveEntrySmartStart(page)).toBeVisible();
            await expect.soft(clientPage.locators.noActiveEntryGroupTraning(page)).toBeVisible();
        });
    });

    test("Переход на страницу создания нового пользователя", async ({ page, authPage, headerBlock, createUserPage }) => {
        const newUserPhone = getRandomPhoneNumber();
        await test.step("Перейти на страницу входа", async () => {
            await page.goto('')
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.autorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Ввести номер телефона, и перейти на страницу создания нового клиента", async () => {
            await headerBlock.newUser(page, newUserPhone)
        });

        await test.step("Проверить что пользователь находится на странице создания нового клиента", async () => {
            expect(page.url()).toContain(`add-client?phone=${newUserPhone.replace("+", "")}`);
        });

        await test.step("Проверить что номер в инпуте соответствуете валиден и соответствует ранее введенному номеру", async () => {
            await expect(createUserPage.locators.userPhone(page, newUserPhone)).toBeVisible();
        });
    });
});