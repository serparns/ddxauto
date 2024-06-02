import authCRMTestData from "@data/authCRM.json";
import { getBaseParameters } from "@entities/baseParameters";
import { selectNotesData } from "@entities/db/notes.db";
import { getUserRequestJson } from "@entities/interface/user.requestJson";
import { Statuses } from "@libs/statuses";
import { expect } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import UsersRequests from "@requests/users.requests";
import test from "@tests/ui/baseTest.fixture";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";

test.describe("Проверка блокировки пользователя", async () => {
    const userPhone = getRandomPhoneNumber()
    let userId: any;
    let clubId: number;

    test.beforeAll(async ({ request }) => {
        await test.step("Получить id клуба", async () => {
            const getClubs = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0]
            return getClubs.id;
        });

        await test.step("создать пользователя и получить данные о нем", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), userPhone);
            return userId = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data.id
        });
    })

    test("Поиск по существующего клиента номеру телефона", async ({ page, authPage, headerBlock, clientPage }) => {
        await test.step("Перейти на страницу входа", async () => {
            await page.goto('')
        });

        await test.step("Заполнить форму авторизации и нажать зайти", async () => {
            await authPage.authorization(page, authCRMTestData.login, authCRMTestData.password);
        });

        await test.step("Ввести номер телефона, и проверить наличие кнопки 'Открыть'", async () => {
            await headerBlock.oldUser(page, userPhone)
        });

        await test.step("Открыть страницу пользователя, и проверить id на соответствие", async () => {
            await headerBlock.locators.openButton(page).click();
            expect(page.url()).toContain(`client/${userId}`);
        });

        await test.step("Заблокировать пользователя, и проверить что он заблокирован", async () => {
            await clientPage.locators.blockButton(page).click();
            await clientPage.locators.enterBlockNoteText(page).fill('block');
            await clientPage.locators.blockButton(page).nth(1).click();
            await expect(clientPage.locators.unLockButton(page)).toBeVisible();
            await expect(clientPage.locators.noteBlock(page)).toBeVisible();
        });

        await test.step("Запрос информации из бд о том что пользователь заблокирован", async () => {
            const notesType = await test.step("Получить тип заметки", async () => { return (await selectNotesData(userId)).type })
            expect(notesType).toEqual('block')
        });
    });
});