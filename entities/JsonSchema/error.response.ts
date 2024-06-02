import { JSONSchemaType } from "ajv";

export default class errorDataSchema {
    code: string;
    message: string;
};

export const errorDataJsonSchema: JSONSchemaType<errorDataSchema> = {
    type: "object",
    properties: {
        code: { type: "string" },
        message: { type: "string" }
    },
    required: [
        "code",
        "message",
    ],
    additionalProperties: false
};