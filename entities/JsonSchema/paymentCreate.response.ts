import { JSONSchemaType } from "ajv";

export class PaymentPlanSchema {
    currency: string;
    payment_service_id: number;
    total_amount: number;
    transactions: Array<object>;
};

export const paymentPlanV2Schema: JSONSchemaType<PaymentPlanSchema> = {
    type: "object",
    properties: {
        currency: { type: "string" },
        payment_service_id: { type: "integer" },
        total_amount: { type: "integer" },
        transactions: { type: "array", items: { type: "object" } }
    },
    required: [
        "currency",
        "payment_service_id",
        "total_amount",
        "transactions",
    ]
};

export class userPaymentV2TransactionsObjectPlanSchema {
    id: number;
    parent_id: number;
    status: string;
    price: object;
};

export const userPaymentPlanV2TransactionsObjectSchema: JSONSchemaType<userPaymentV2TransactionsObjectPlanSchema> = {
    type: "object",
    properties: {
        id: { type: "integer" },
        parent_id: { type: "integer" },
        status: { type: "string" },
        price: { type: "object" }
    },
    required: [
        "id",
        "status",
        "price",
    ]
};

export class UserPaymentPlanV2PriceObjectSchema {
    our_amount: number;
    partner_amount: number;
    discount_amount: number;
    deposit_amount: number;
    total_amount: number;
};

export const userPaymentPlanV2PriceObjectSchema: JSONSchemaType<UserPaymentPlanV2PriceObjectSchema> = {
    type: "object",
    properties: {
        our_amount: { type: "integer" },
        partner_amount: { type: "integer" },
        discount_amount: { type: "integer" },
        deposit_amount: { type: "integer" },
        total_amount: { type: "integer" },
    },
    required: [
        "total_amount",
    ]
};