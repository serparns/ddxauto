import { clubDataResponseJsonSchema } from "@entities/JsonSchema/club.response";
import { errorDataJsonSchema } from "@entities/JsonSchema/error.response";
import { getBaseFalseParameters, getBaseParameters } from "@entities/baseParameters";
import { Statuses } from "@libs/statuses";
import { expect, test } from "@playwright/test";
import ClubsRequests from "@requests/clubs.requests";
import { validatorJson } from "@utils/validator";

const clubs = [4, 5, 7, 8]

test.describe("Api-тесты на получение списка клубов", async () => {
    test("[positive] получить список клубов", async ({ request }) => {
        const response = (await (await new ClubsRequests(request).getClubs(Statuses.OK, await getBaseParameters())).json()).data[0]
        validatorJson(clubDataResponseJsonSchema, (response))
    });

    test("[negative] получить список клубов, убрать один из обязательных параметров", async ({ request }) => {
        const response = (await (await new ClubsRequests(request).getClubs(Statuses.BAD_REQUEST, await getBaseFalseParameters())).json()).error
        expect(response.message).toContain('API session_id required')
        validatorJson(errorDataJsonSchema, (response))
    });

    clubs.forEach(clubs => {
        test(`[positive] получить информация по клубу ${clubs}`, async ({ request }) => {
            const response = (await (await new ClubsRequests(request).getClubById(Statuses.OK, await getBaseParameters(), clubs)).json()).data[0]
            validatorJson(clubDataResponseJsonSchema, (response))
        });
    });
});