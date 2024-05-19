import { cardTokensJsonShema } from "@entities/JsonSchema/cardTokens.response";
import { getBaseParameters } from "@entities/baseParameters";
import { selectCountFromCardTokens, selectUserIdFromCardTokens } from "@entities/db/cardToken.db";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import CardTokensRequests from "@requests/cardTokens.request";
import { validatorJson } from "@utils/validator";

test.describe("Api-тесты на получение платежных токенов пользователя", async () => {
    const getCardTokensRequestJson = async (
        request: APIRequestContext,
        status: Statuses,
        parameters?: {
            userId?: number
        }) => {
        const params = async (): Promise<object> => {
            let params = await getBaseParameters()
            if (parameters?.userId != undefined) params = { ...params, ...{ user_id: parameters.userId } }
            return params;
        }
        return await new CardTokensRequests(request).getCardTokens(status, await params());
    }

    test("Получения Платежных токенов пользователя", async ({ request }) => {
        const userId = (await test.step("Получить id пользователя", async () => { return (await selectUserIdFromCardTokens()) })).user_id
        const countUserCardTokensDb = (await test.step("Получить количество", async () => { return (await selectCountFromCardTokens(userId)) }))
        const getCardTokensUser = await (await test.step("Получить кардтокены пользователи из запроса", async () => getCardTokensRequestJson(request, Statuses.OK, { userId: userId }))).json()

        await test.step("Проверки", async () => {
            expect(getCardTokensUser.data[0].user_id.toString()).toEqual(countUserCardTokensDb[0].user_id)
            expect(getCardTokensUser.data[0].public_card_number.toString()).toEqual(countUserCardTokensDb[0].public_card_number)
            expect(getCardTokensUser.data[0].payment_service_id.toString()).toEqual(countUserCardTokensDb[0].payment_service_id)
            expect(getCardTokensUser.data[0].id.toString()).toEqual(countUserCardTokensDb[0].id)
            expect(getCardTokensUser.data.length).toEqual(countUserCardTokensDb.length)
            await validatorJson(cardTokensJsonShema, (getCardTokensUser.data[0]));
        })// не стал использовать перебор для поиска id, понадеялcя на сортировку бека:)
    });
});