import {APIRequestContext, expect, test} from "@playwright/test";
import {Statuses} from "@libs/statuses";
import DiscountsRequests from "@requests/discounts.requests";
import {getBaseParameters} from "@entities/baseParameters";
import discountTestData from "@data/discounts.json"

test.describe("Api-тесты на получение списка акций", async () => {
    const discountResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters?: {
            isActive?: '' | any
            orderBy?: '' | any
        }) => {
        const params = {
            ...await getBaseParameters(),
            is_active: parameters?.isActive,
            order_by: parameters?.orderBy
        }
        return await new DiscountsRequests(request).getDiscounts(status, params);
    }

    test("стандартоное получение акций без параметров", async ({request}) => {
        const discount = await (await test.step("",
            async () => discountResponse(request, Statuses.OK, {isActive: '', orderBy: ''}))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].id).toEqual(9)
        })
    });

    test("получение акций с активностью", async ({request}) => {
        const discount = await (await test.step("",
            async () => discountResponse(request, Statuses.OK,
                {isActive: discountTestData.is_active.true, orderBy: discountTestData.order_by.desc}))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].id).toEqual(744)
        })
    });

    test("получение не активных акций ", async ({request}) => {
        const discount = await (await test.step("",
            async () => discountResponse(request, Statuses.OK,
                {isActive: discountTestData.is_active.false, orderBy: discountTestData.order_by.desc}))).json()

        await test.step("Проверки", async () => {
            expect(discount.data[0].is_active).toEqual(false)
        })
    });
})