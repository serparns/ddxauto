import { JSONSchemaType } from "ajv";

export class UserVerifyDataSchema {
    id: number;
    email: string;
    name: string;
    last_name: string;
    middle_name: string;
    sex: string;
    phone: string;
    lang: string;
    home_club_id: number;
    club_access: boolean;
    admin_panel_access: boolean;
    group_training_registration_access: boolean;
    qr_token: string;
};

export const userVerifyDataSchema: JSONSchemaType<UserVerifyDataSchema> = {
    type: "object",
    properties: {
        id: { type: "number" },
        email: { type: "string" },
        name: { type: "string" },
        last_name: { type: "string" },
        middle_name: { type: "string" },
        sex: { type: "string" },
        phone: { type: "string" },
        lang: { type: "string" },
        home_club_id: { type: "number" },
        club_access: { type: "boolean" },
        admin_panel_access: { type: "boolean" },
        group_training_registration_access: { type: "boolean" },
        qr_token: { type: "string" }
    },
    required: [
        "id",
        "email",
        "name",
        "last_name",
        "middle_name",
        "sex",
        "phone",
        "lang",
        "home_club_id",
        "club_access",
        "admin_panel_access",
        "group_training_registration_access",
        "qr_token"
    ]
};

export class UserVerifyBaseSchema {
    session_id: string;
    request_id: string;
    verification_token: string;
};

export const userVerifyBaseSchema: JSONSchemaType<UserVerifyBaseSchema> = {
    type: "object",
    properties: {
        session_id: { type: "string" },
        request_id: { type: "string" },
        verification_token: { type: "string" },
    },
    required: [
        "session_id",
        "request_id",
        "verification_token",
    ]
};