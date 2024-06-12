import { JSONSchemaType } from "ajv";

export class GroupTrainingSchema {
    id: number;
    name: string;
    group_training_category: object;
    description: string;
    photo_url: Array<object>;
    is_deleted: boolean;
    intensity: number;
};

export const groupTrainingSchema: JSONSchemaType<GroupTrainingSchema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
        group_training_category: { type: "object" },
        description: { type: "string" },
        photo_url: { type: "array", items: { type: "object" } },
        is_deleted: { type: "boolean" },
        intensity: { type: "integer" }
    },
    required: [
        "id",
        "name",
        "group_training_category",
        "description",
        "photo_url",
        "is_deleted",
        "intensity"
    ]
};