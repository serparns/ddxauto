import { DataTypes } from "sequelize";
import { db } from "utils/dbConnect";

export interface TransactionsDB {
    id: number;
    provider_id: number;
    type: string;
    gate_id: number;
    user_id: number;
    user_payment_plan_id: number;
    discount_id: number;
    our_amount: number;
    partner_amount: number;
    discount_amount: number;
    total_amount: number;
    currency: string;
    payment_service_id: number;
    supp_transaction_id: string;
    card_token_id: number;
    employee_id: number;
    status: string;
    response: JSON;
    http_response_code: number;
    payment_service_response_code: number;
    receipt_id: number;
    is_deleted: boolean;
    description: string;
    fiscal_method: string;
    deposit_amount: number;
    created_at: string;
    updated_at: string;
    payment_transaction_id: number;
    join_fee: number;
    membership_fee: number;
    widget_settings: JSON;
    club_legal_info_id: number;
    discount_code_id: number;
    refund_balance: number;
}

export const transactionsDB = db.define(
    'transactions',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        provider_id: { type: DataTypes.BIGINT },
        type: { type: DataTypes.STRING },
        gate_id: { type: DataTypes.BIGINT },
        user_id: { type: DataTypes.BIGINT },
        user_payment_plan_id: { type: DataTypes.BIGINT },
        discount_id: { type: DataTypes.BIGINT },
        our_amount: { type: DataTypes.NUMBER },
        partner_amount: { type: DataTypes.NUMBER },
        discount_amount: { type: DataTypes.NUMBER },
        total_amount: { type: DataTypes.NUMBER },
        currency: { type: DataTypes.STRING },
        payment_service_id: { type: DataTypes.BIGINT },
        supp_transaction_id: { type: DataTypes.STRING },
        card_token_id: { type: DataTypes.BIGINT },
        employee_id: { type: DataTypes.BIGINT },
        status: { type: DataTypes.STRING },
        response: { type: DataTypes.JSONB },
        http_response_code: { type: DataTypes.NUMBER },
        payment_service_response_code: { type: DataTypes.NUMBER },
        receipt_id: { type: DataTypes.BIGINT },
        is_deleted: { type: DataTypes.BOOLEAN },
        description: { type: DataTypes.STRING },
        fiscal_method: { type: DataTypes.STRING },
        deposit_amount: { type: DataTypes.NUMBER },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
        payment_transaction_id: { type: DataTypes.BIGINT },
        join_fee: { type: DataTypes.NUMBER },
        membership_fee: { type: DataTypes.NUMBER },
        widget_settings: { type: DataTypes.JSONB },
        club_legal_info_id: { type: DataTypes.BIGINT },
        discount_code_id: { type: DataTypes.BIGINT },
        refund_balance: { type: DataTypes.NUMBER },
    },
    {
        timestamps: false
    }
)

export async function selectTransaction(userId: number): Promise<Array<TransactionsDB>> {
    const result = await db.query(`SELECT * FROM transactions  WHERE user_id = '${userId}'`,
        { model: transactionsDB, mapToModel: true });
    return <TransactionsDB | any>result;
}

export async function selectUserIdByTransaction(): Promise<TransactionsDB> {
    const result = await db.query(`SELECT user_id FROM transactions order by user_id desc limit 1`,
        { model: transactionsDB, mapToModel: true });
    return <TransactionsDB | any>result[0];
}