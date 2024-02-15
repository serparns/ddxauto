import {JSONSchemaType} from "ajv";

export default class errorDataJson {
    code: string;
    message: string;

}

export const ErrorDataJsonSchema: JSONSchemaType<errorDataJson> = {
    type: "object",
    properties: {
        code: {type: "string"},
        message: {type: "string"}

    },
    required: [
        "code",
        "message",
    ],
    additionalProperties: false
}