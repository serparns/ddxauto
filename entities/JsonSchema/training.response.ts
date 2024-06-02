import { JSONSchemaType } from "ajv";

export default class TrainingDataSchema {
    group_training_time_table_id: number;
    parent_id: number;
};

export const trainingDataJsonSchema: JSONSchemaType<TrainingDataSchema> = {
    type: "object",
    properties: {
        group_training_time_table_id: { type: "integer" },
        parent_id: { type: "integer" },

    },
    required: [
        "group_training_time_table_id",
        "parent_id"

    ],
    additionalProperties: false
};