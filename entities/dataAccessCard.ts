import {getRandomCardNumber} from "../utils/random";
export async function dataAccessCard(): Promise<object> {
    return {
        access_card_number: getRandomCardNumber(),
        user_id: 1346578,
        is_blocked: false,
        is_lost: false,
        is_deleted: false,
        block_previous_card: false
    }
}