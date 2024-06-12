import { errorDataJsonSchema } from "@entities/JsonSchema/error.response";
import { groupTrainingSchema } from "@entities/JsonSchema/groupTraining.response";
import { groupTrainingCategorySchema } from "@entities/JsonSchema/groupTrainingCategory.response";
import { getBaseFalseParameters, getBaseParameters } from "@entities/baseParameters";
import { Statuses } from "@libs/statuses";
import { expect, test } from "@playwright/test";
import GroupTrainingRequests from "@requests/groupTrainingRequests.request";
import { validatorJson } from "@utils/validator";

test.describe("Api-тесты на получение групповых тренировок", async () => {
    test("[positive] получить список названий групповых тренировок", async ({ request }) => {
        await test.step("получить id групповой тренировки", async () => {
            const response = (await (await new GroupTrainingRequests(request).getGroupTraining(Statuses.OK, await getBaseParameters())).json()).data[0];

            await test.step("Проверки", async () => {
                validatorJson(groupTrainingCategorySchema, (response.group_training_category));
                validatorJson(groupTrainingSchema, (response));
            });
        });
    });

    test("[negative] получить список названий групповых тренировок, не передавая обязательный 'session_id'", async ({ request }) => {
        await test.step("получить id групповой тренировки", async () => {
            const response = (await (await new GroupTrainingRequests(request).getGroupTraining(Statuses.BAD_REQUEST, await getBaseFalseParameters())).json()).error;

            await test.step("Проверки", async () => {
                expect(response.message).toBe("API session_id required")
                validatorJson(errorDataJsonSchema, (response));
            })
        })
    });
})