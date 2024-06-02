import { Statuses } from "@libs/statuses";
import { test } from "@playwright/test";
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
};

test.describe("Добавление карты доступа", async () => {
    test("[positive] добавить карту доступа", async ({ request }) => {
        await new AccessCardsRequests(request).postAccessCards(Statuses.OK, requestBody)
    });
});