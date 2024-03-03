import { JSONSchemaType } from "ajv";

export class  TimeTableShema {
    id: number;
    is_payable: boolean;
    start_time: string;
    end_time: string;
    free_seats: number;
    count_seats: number;
    queue_available: boolean;
    parent_id: number;
    booking_start_at: string;
    booking_end_at: string;
    employee: any;
    // club: object;
    // club_zone: object;
    // users: object;
    // group_training: object;
}

export const timeTableShema: JSONSchemaType<TimeTableShema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        is_payable: { type: "boolean" },
        start_time: { type: "string" },
        end_time: { type: "string" },
        free_seats: { type: "integer" },
        count_seats: { type: "integer" },
        queue_available: { type: "boolean" },
        parent_id: { type: "integer" },
        booking_start_at: { type: "string" },
        booking_end_at: { type: "string" },
         employee: { type: "object"},
        // club: { type: "array" },
        // club_zone: { type: "array" },
        // users: { type: "array" },
        // group_training: { type: "array" }
    },
    required: [
        "id",
        "is_payable",
        "start_time",
        "end_time",
        "free_seats",
        "count_seats",
        "queue_available",
        "parent_id",
        "booking_start_at",
        "booking_end_at",
        "employee",
        // "club",
        // "club_zone",
        // "users",
        // "group_training"
    ],
    additionalProperties: false
}
//TODO Сделать схему ответа, понять почему при array ошибка, может нужно как-то дополнить