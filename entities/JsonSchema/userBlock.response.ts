import { JSONSchemaType } from "ajv";

export class UserBlockDataShema {
    employee_id: number;
    last_name: string;
    name: string;
    notes: object;
    user: object;
}

export const userBlockDataShema: JSONSchemaType<UserBlockDataShema> = {
    type: "object",
    properties: {
        employee_id: { type: "integer" },
        last_name: { type: "string" },
        name: { type: "string" },
        notes: { type: "object" },
        user: { type: "object" },
    },
    required: [
        "employee_id",
        "last_name",
        "name",
        "notes",
        "user"
    ]
}