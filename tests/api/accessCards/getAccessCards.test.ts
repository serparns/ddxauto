import { getBaseParameters } from "@entities/baseParameters";
import { Statuses } from "@libs/statuses";
import { expect, test } from "@playwright/test";
import AccessCardsRequests from "@requests/accessCards.requests";
import { getRandomCardNumber } from "@utils/random";

const requestBody = {
    "session_id": "123",
    "request_id": "123",
    "request_source": "123",
    "data": [
        {
            "access_card_number": getRandomCardNumber(),
            "user_id": 1356359,
            "type": "bracelet",
            "is_blocked": false,
            "is_lost": false,
            "is_deleted": false,
            "block_previous_card": false
        }
    ]
}
test.describe("Тесты на получение карты доступа", async () => {
    test("[positive] получить карту доступа", async ({ request }) => {
        const createdCard = await new AccessCardsRequests(request).postAccessCards(Statuses.OK, requestBody)
        const response = await new AccessCardsRequests(request).getAccessCardsById(Statuses.OK, await getBaseParameters(),
            (await createdCard.json()).data[0].id);
        expect((await response.json()).data[0].user.id).toEqual((await createdCard.json()).data[0].user.id);
    })
    test("[positive] получить карту доступа v_2", async ({ request }) => {
        const requestClass = new AccessCardsRequests(request);
        const parameters = await getBaseParameters();
        const createdCard = await requestClass.postAccessCards(Statuses.OK, requestBody);
        const cardId = (await createdCard.json()).data[0].id;
        const response = await requestClass.getAccessCardsById(Statuses.OK, parameters, cardId);
        expect((await response.json()).data[0].user.id).toEqual((await createdCard.json()).data[0].user.id);
    });
})