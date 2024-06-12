import { JSONSchemaType } from "ajv";

export class UserPaymentPlanSchema {
    id: number;
    user_id: number;
    signed_date: string;
    start_date: string;
    status: string;
    parent_id: number
    payment_plan: object;
    club: object;
};

export const userPaymentPlanSchema: JSONSchemaType<UserPaymentPlanSchema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        signed_date: { type: "string" },
        start_date: { type: "string" },
        status: { type: "string" },
        parent_id: { type: "integer" },
        payment_plan: { type: "object" },
        club: { type: "object" },
    },
    required: [
        "id",
        "user_id",
        "signed_date",
        "start_date",
        "status",
        "payment_plan",
        "club"
    ]
};

export class userPaymentObjectPlanSchema {
    id: number;
    name: string;
    payment_plan_type: string;
    currency_code: string;
    our_join_fee: number;
    membership_fee: number;
    is_recurrent: boolean;
    is_multi_club_access: boolean;
    is_spa_access: boolean;
    payment_interval: number;
    interval_type: string;
    is_group_training_access: boolean;
    is_fitness_access: boolean
};

export const userPaymentPlanObjectSchema: JSONSchemaType<userPaymentObjectPlanSchema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
        currency_code: { type: "string" },
        our_join_fee: { type: "integer" },
        membership_fee: { type: "integer" },
        is_recurrent: { type: "boolean" },
        is_multi_club_access: { type: "boolean" },
        is_spa_access: { type: "boolean" },
        payment_interval: { type: "integer" },
        interval_type: { type: "string" },
        is_group_training_access: { type: "boolean" },
        is_fitness_access: { type: "boolean" },
        payment_plan_type: { type: "string" },
    },
    required: [
        "id",
        "name",
        "payment_plan_type",
        "currency_code",
        "our_join_fee",
        "membership_fee",
        "is_recurrent",
        "is_multi_club_access",
        "is_spa_access",
        "payment_interval",
        "interval_type",
        "is_group_training_access",
        "is_fitness_access",
    ]
};

export class UserClubObjectSchema {
    id: number;
    name: string;
};

export const userClubObjectSchema: JSONSchemaType<UserClubObjectSchema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        name: { type: "string" },
    },
    required: [
        "id",
        "name",
    ]
};