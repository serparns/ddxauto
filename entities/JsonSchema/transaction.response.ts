import { JSONSchemaType } from "ajv";

export interface TransactionDataSchema {
    card_token_id: number;
    created_at: string;
    currency: string;
    deposit_amount: number;
    description: string;
    discount: object;
    discount_amount: number;
    employee: object;
    fiscal_method: string;
    gate: object;
    id: number;
    join_fee: number;
    membership_fee: number;
    our_amount: number;
    partner_amount: number;
    payment_service: object;
    payment_transaction_id: number;
    provider: object;
    public_card_number: string;
    refund_balance: number;
    response_code: number;
    status: string,
    supp_transaction_id: string;
    total_amount: number;
    type: string;
    updated_at: string;
    user: object;
    user_payment_plan_id: number;
    receipt: object;
};

export const transactionResponseSchema: JSONSchemaType<TransactionDataSchema> = {
    type: "object",
    properties: {
        card_token_id: { type: "number" },
        created_at: { type: "string" },
        currency: { type: "string" },
        deposit_amount: { type: "number" },
        description: { type: "string" },
        discount: { type: "object" },
        discount_amount: { type: "number" },
        employee: { type: "object" },
        fiscal_method: { type: "string" },
        gate: { type: "object" },
        id: { type: "number" },
        join_fee: { type: "number" },
        membership_fee: { type: "number" },
        our_amount: { type: "number" },
        partner_amount: { type: "number" },
        payment_service: { type: "object" },
        payment_transaction_id: { type: "number" },
        provider: { type: "object" },
        public_card_number: { type: "string" },
        response_code: { type: "number" },
        refund_balance: { type: "number" },
        status: { type: "string" },
        supp_transaction_id: { type: "string" },
        total_amount: { type: "number" },
        type: { type: "string" },
        updated_at: { type: "string" },
        user: { type: "object" },
        user_payment_plan_id: { type: "number" },
        receipt: { type: "object" }
    },
    required: [
        "card_token_id",
        "created_at",
        "currency",
        "deposit_amount",
        "description",
        "discount",
        "discount_amount",
        "employee",
        "fiscal_method",
        "gate",
        "id",
        "join_fee",
        "membership_fee",
        "our_amount",
        "partner_amount",
        "payment_service",
        "payment_transaction_id",
        "provider",
        "public_card_number",
        "response_code",
        "refund_balance",
        "status",
        "supp_transaction_id",
        "total_amount",
        "type",
        "updated_at",
        "user",
        "user_payment_plan_id"
    ],
    additionalProperties: true
};