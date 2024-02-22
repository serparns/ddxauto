import { APIRequestContext, expect, test } from "@playwright/test";
import { Statuses } from "@libs/statuses";
import DiscountsRequests from "@requests/discounts.requests";
import { getBaseParameters } from "@entities/baseParameters";
import discountTestData from "@data/discounts.json"

test.describe("Api-тесты на получение списка акций", async () => {
    const discountResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters?: {
            isActive?: boolean
            orderBy?: string
            limit?: string
        }) => {
        const params = async (): Promise<object> => {
            let params = await getBaseParameters()
            if (parameters?.isActive != undefined) params = { ...params, ...{ is_active: parameters.isActive } }
            if (parameters?.orderBy != undefined) params = { ...params, ...{ order_by: parameters.orderBy } }
            if (parameters?.limit != undefined) params = { ...params, ...{ limit: parameters.limit } }
            return params;
        }
        return await new DiscountsRequests(request).getDiscounts(status, await params());
    }

    test("Получение списка акций", async ({ request }) => {
        const discount = await (await test.step("Получение акций",
            async () => discountResponse(request, Statuses.OK))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].id).not.toBe(null)
        })
    });

    test("Получение списка активных акций", async ({ request }) => {
        const discount = await (await test.step("Получение акций",
            async () => discountResponse(request, Statuses.OK,
                { isActive: discountTestData.is_active.true, orderBy: discountTestData.order_by.desc }))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].id).not.toBe(null)
        })
    });

    test("Получение списка не активных акций по убыванию", async ({ request }) => {
        const discount = await (await test.step("Получение акций",
            async () => discountResponse(request, Statuses.OK,
                { isActive: discountTestData.is_active.false, orderBy: discountTestData.order_by.desc }))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].id).not.toBe(null)
            expect(discount.data[0].is_active).toEqual(false)
        })
    });
    test("Получение списка не активных акций по возрастанию", async ({ request }) => {
        const discount = await (await test.step("Получение акций",
            async () => discountResponse(request, Statuses.OK,
                { isActive: discountTestData.is_active.false, orderBy: discountTestData.order_by.asc }))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].id).not.toBe(null)
            expect(discount.data[0].is_active).toEqual(false)
        })
    });

    test("Получение одной не активной акции", async ({ request }) => {
        const discount = await (await test.step("Получение акций",
            async () => discountResponse(request, Statuses.OK,
                { isActive: discountTestData.is_active.false, limit: '1' }))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].id).not.toBe(null)
            expect(discount.data[0].is_active).toEqual(false)
        })
    });
})