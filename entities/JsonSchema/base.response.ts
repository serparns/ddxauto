import { JSONSchemaType } from "ajv";

export default class BaseDataSchema {
    session_id: string;
    request_id: string;
    request_source: string | null;
    data: object | null;
    error: object | null;
}

export const baseDataJsonSchema: JSONSchemaType<BaseDataSchema> = {
    type: "object",
    properties: {
        session_id: { type: "string" },
        request_id: { type: "string" },
        request_source: { type: "string" },
        data: { type: "object" },
        error: { type: "object" }
    },
    required: [
        "session_id",
        "request_id",
    ],
    additionalProperties: false
}