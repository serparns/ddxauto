import { transactionResponseShema } from "@entities/JsonSchema/transaction.response";
import { getBaseParameters } from "@entities/baseParameters";
import { selectTransaction, selectUserIdByTransaction } from "@entities/db/transactions.db";
import { Statuses } from "@libs/statuses";
import { APIRequestContext, expect, test } from "@playwright/test";
import TransactionRequests from "@requests/transaction.requests";
import { validatorJson } from "@utils/validator";

test.describe("Api-тесты на получение транзакций пользователя", async () => {
    const transactionResponse = async (
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
        return await new TransactionRequests(request).getTransactionUser(status, await params());
    }

    test("Получение списка транзакций пользователя", async ({ request }) => {
        const userId = (await test.step("Получить id пользователя", async () => { return (await selectUserIdByTransaction()) })).user_id
        const transactionId = (await (await test.step("Получение транзакций", async () => transactionResponse(request, Statuses.OK, { userId: userId }))).json()).data[0]
        const selectTransactionId = (await test.step("Получить транзакции пользователя", async () => { return (await selectTransaction(userId)) })).id

        await test.step("Проверки", async () => {
            let selectTransactionIdNumber: number = Number(selectTransactionId)
            expect(transactionId.id).toEqual(selectTransactionIdNumber)
            await validatorJson(transactionResponseShema, (transactionId));
        })
    });
});