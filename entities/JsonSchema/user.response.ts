import {JSONSchemaType} from "ajv";

export default  class  UsersDataJson {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    email: string;
    last_name: string;
    middle_name: string;
    sex: string;
    phone: string;
    birthday: string;
    parent: number;
    lang: string;
    user_photo: string;
    home_club_id: number;
    balance: number;
    club_access: boolean;
    admin_panel_access: boolean;
    group_training_registration_access: boolean;
    sport_experience: string;
    is_qr_check: boolean;
    qr_token: string;

}

export const userDataJsonSchema: JSONSchemaType<UsersDataJson> = {
    type: "object",
    properties: {
        id: {type: "integer"},
        created_at: {type: "string"},
        updated_at: {type: "string"},
        name: {type: "string"},
        email: {type: "string"},
        last_name: {type: "string"},
        middle_name: {type: "string"},
        sex: {type: "string"},
        phone: {type: "string"},
        birthday: {type: "string"},
        parent: {type: "integer"},
        lang: {type: "string"},
        user_photo: {type: "string"},
        home_club_id: {type: "integer"},
        balance: {type: "integer"},
        club_access: {type: "boolean"},
        admin_panel_access: {type: "boolean"},
        group_training_registration_access: {type: "boolean"},
        sport_experience: {type: "string"},
        is_qr_check: {type: "boolean"},
        qr_token: {type: "string"},
    },
    required: [
        "id",
        "created_at",
        "updated_at",
        "name",
        "email",
        "last_name",
        "middle_name",
        "sex",
        "phone",
        "birthday",
        "parent",
        "lang",
        "user_photo",
        "home_club_id",
        "balance",
        "club_access",
        "admin_panel_access",
        "group_training_registration_access",
        "sport_experience",
        "is_qr_check",
        "qr_token"

    ],
    additionalProperties: false
}