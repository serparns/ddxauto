import { userBlockDataSchema } from "@entities/JsonSchema/userBlock.response";
import { getBaseParameters } from "@entities/baseParameters";
import { selectNotesData } from "@entities/db/notes.db";
import { getUserRequestJson, postUserBlockRequestJson } from "@entities/interface/user.requestJson";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import UsersRequests from "@requests/users.requests";
import { getRandomEmail, getRandomPhoneNumber } from "@utils/random";
import { validatorJson } from "@utils/validator";

test.describe("Тест на блокировку пользователя", async () => {
    let userId: number
    let clubId: number;

    const userBlockResponse = async (
        request: APIRequestContext,
        status: Statuses,) => {
        const requestBody = await postUserBlockRequestJson()
        return await new UsersRequests(request).postUsersBlock(status, requestBody, userId);
    }

    test.beforeAll(async ({ request }) => {
        await test.step("Получить id клуба", async () => {
            return clubId = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters())).json()).data[0].id
        });

        await test.step("создать пользователя и получить данные о нем", async () => {
            const requestBody = await getUserRequestJson(clubId, getRandomEmail(), getRandomPhoneNumber());
            return userId = (await (await new UsersRequests(request).postCreateUser(Statuses.OK, requestBody)).json()).data.id
        });
    })

    test("Блокировка пользователя", async ({ request }) => {
        const userBlockData = (await (await test.step("Блокировка пользователя", async () => userBlockResponse(request, Statuses.OK))).json()).data
        const notesType = await test.step("Получить тип заметки", async () => { return (await selectNotesData(userId)).type })

        await test.step("Проверки", async () => {
            expect(userBlockData.user.id).toEqual(userId);
            expect(userBlockData.notes.text).toEqual('Где деньги Лебовски');
            expect(userBlockData.notes.type).toEqual('block');
            expect(userBlockData.notes.type).toEqual(notesType);
            await validatorJson(userBlockDataSchema, (userBlockData));
        })
    });


})