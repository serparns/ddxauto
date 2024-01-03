import {getRandomCardNumber} from "../utils/random";
import { type } from "../tests/postAccessCards.test";


export async function dataParans(): Promise<object> {
    return {
        session_id: "123",
        request_id: "123",
        request_source: "123"
    }
    }
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