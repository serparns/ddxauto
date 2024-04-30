import { JSONSchemaType } from "ajv";

export default class errorDataShema {
    code: string;
    message: string;

}

export const errorDataJsonSchema: JSONSchemaType<errorDataShema> = {
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
}