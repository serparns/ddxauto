import { JSONSchemaType } from "ajv";

export default class CardTokensSchema {
    id: number;
    user_id: number;
    payment_service_id: number;
    public_card_number: string;
    is_deleted: boolean;
    updated_at: string;
    created_at: string;
}

export const cardTokensJsonSchema: JSONSchemaType<CardTokensSchema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        payment_service_id: { type: "integer" },
        public_card_number: { type: "string" },
        is_deleted: { type: "boolean" },
        updated_at: { type: "string" },
        created_at: { type: "string" },
    },
    required: [
        "id",
        "user_id",
        "payment_service_id",
        "public_card_number",
        "is_deleted",
        "updated_at",
        "created_at"

    ],
    additionalProperties: false
}