import {JSONSchemaType} from "ajv";

export default class TrainingDataJson {
    group_training_time_table_id: number;
    parent_id: number;
}

export const trainingDataJsonSchema: JSONSchemaType<TrainingDataJson> = {
    type: "object",
    properties: {
        group_training_time_table_id: {type: "integer"},
        parent_id: {type: "integer"},

    },
    required: [
        "group_training_time_table_id",
        "parent_id"

    ],
    additionalProperties: false
}