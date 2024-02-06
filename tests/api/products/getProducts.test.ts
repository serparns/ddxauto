import {APIRequestContext, expect, test} from "@playwright/test";
import {Statuses} from "@libs/statuses";
import {getBaseParameters} from "@entities/baseParameters";
import ProductdRequests from "@requests/products.requests";

test.describe("Api-тест на получение продуктов", async () => {
    const productsGetResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters?: {
            category?: string
        }) => {
        const params = async (): Promise<object> => {
            let params = await getBaseParameters()
            if (parameters?.category != undefined) params = {...params, ...{category: parameters.category}}
            return params;
        }
        return await new ProductdRequests(request).getProducts(status, await params());
    }

    test("[positive] Получение продуктов всех категорий", async ({request}) => {
        const productSuccessResponse = await test.step("получение продуктов",
            async () => productsGetResponse(request, Statuses.OK));

        await test.step("Проверки", async () => {
            expect((await productSuccessResponse.json()).data[0].category).not.toBe(null)
        })
    })

    test("[positive] Получение продуктов категории freeze", async ({request}) => {
        const productSuccessResponse = await test.step("получение продуктов",
            async () => productsGetResponse(request, Statuses.OK, {category: "freeze"}));

        await test.step("Проверки", async () => {
            expect((await productSuccessResponse.json()).data[0].category).toEqual("freeze");
        })
    })

    test("[positive] Получение продуктов категории system ", async ({request}) => {
        const productSuccessResponse = await test.step("получение продуктов",
            async () => productsGetResponse(request, Statuses.OK, {category: "system"}));

        await test.step("Проверки", async () => {
            expect((await productSuccessResponse.json()).data[0].category).toEqual("system");
        })
    })

    test("[positive] Получение продуктов категории access card ", async ({request}) => {
        const productSuccessResponse = await test.step("получение продуктов",
            async () => productsGetResponse(request, Statuses.OK, {category: "access card"}));

        await test.step("Проверки", async () => {
            expect((await productSuccessResponse.json()).data[0].category).toEqual("access card");
        })
    })
});