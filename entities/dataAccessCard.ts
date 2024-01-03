import {getRandomCardNumber} from "../utils/random";


const type = ['bracelet', 'disposable_card']
    export async function dataParans(): Promise<object> {
    return {
        session_id: "123",
        request_id: "123",
        request_source: "123"
    }
    }
    export async function dataAccessCard(): Promise<object> {
        return {data: [{ "access_card_number": getRandomCardNumber(),
                user_id: 1346578,
                is_blocked: false,
                is_lost: false,
                is_deleted: false,
                block_previous_card: false,
                type: "disposable_card",
        }]

        }
    }