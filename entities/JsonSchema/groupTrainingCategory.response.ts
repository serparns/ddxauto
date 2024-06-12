import { JSONSchemaType } from "ajv";

export class GroupTrainingCategorySchema {
    id: number;
    name: string;
    color: string;
    is_deleted: boolean;
    is_smart_start: boolean;
};

export const groupTrainingCategorySchema: JSONSchemaType<GroupTrainingCategorySchema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
        color: { type: "string" },
        is_deleted: { type: "boolean" },
        is_smart_start: { type: "boolean" },
    },
    required: [
        "id",
        "name",
        "color",
        "is_deleted",
        "is_smart_start"
    ]
};