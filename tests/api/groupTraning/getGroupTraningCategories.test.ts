import {APIRequestContext, expect, test} from "@playwright/test";
import {Statuses} from "@libs/statuses";
import {getBaseParameters} from "@entities/baseParameters";
import GroupTrainingCategoriesRequests from "@requests/groupTrainingRequests.request";

test.describe("Api-тесты на на получения категорий груповых тренировок", async () => {
    const groupTrainingCategoryResponse = async (
        request: APIRequestContext,
        status: Statuses,
        parameters?: {
            isDeleted?: boolean
        }) => {
        const params = async (): Promise<object> => {
            let params = await getBaseParameters()
            if (parameters?.isDeleted != undefined) params = {...params, ...{is_deleted: parameters.isDeleted}}
            return params;
        }
        return await new GroupTrainingCategoriesRequests(request).getGroupTrainingCategories(status, await params());
    }

    test("Получение списка не удаленных категорий груповых тренировок", async ({request}) => {
        const groupTrainingCategory = await (await test.step("Получение груповых тренировок",
            async () => groupTrainingCategoryResponse(request,  Statuses.OK,
                {isDeleted: false}))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingCategory.data[0].id).not.toBe(null)
            expect(groupTrainingCategory.data[0].is_deleted).toEqual(false)
        })
    });

    test("Получение списка логически удаленных категорий груповых тренировок", async ({request}) => {
        const groupTrainingCategory = await (await test.step("Получение груповых тренировок",
            async () => groupTrainingCategoryResponse(request, Statuses.OK,
                {isDeleted: true}))).json()

        await test.step("Проверки", async () => {
            expect(groupTrainingCategory.data[0].id).not.toBe(null)
            expect(groupTrainingCategory.data[0].is_deleted).toEqual(true)
        })
    });
    })