import { DataTypes } from "sequelize";
import { db } from "utils/dbConnect";

export interface UserPaymentPlansDB {
    id: number
    user_id: number
    payment_plan_id: number
    club_id: number
    signed_date: string
    start_date: string
    end_date: string
    pay_date: string
    cancel_date: string
    status: string
    previous_status: string
    card_token_id: string
    created_at: string
    updated_at: string
    cancel_reason: string
    discount_id: number
}

export const userPaymentPlansDB = db.define(
    'user_payment_plans',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        user_id: { type: DataTypes.BIGINT },
        payment_plan_id: { type: DataTypes.BIGINT },
        club_id: { type: DataTypes.BIGINT },
        signed_date: { type: DataTypes.DATE },
        start_date: { type: DataTypes.DATE },
        end_date: { type: DataTypes.DATE },
        pay_date: { type: DataTypes.TIME },
        cancel_date: { type: DataTypes.DATE },
        status: { type: DataTypes.STRING },
        previous_status: { type: DataTypes.STRING },
        card_token_id: { type: DataTypes.STRING },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
        cancel_reason: { type: DataTypes.STRING },
        discount_id: { type: DataTypes.BIGINT }
    },
    {
        timestamps: false
    }
);

export async function selectUserPaymenPlanByStatus(status: string): Promise<UserPaymentPlansDB> {
    const result = await db.query(
        `SELECT * FROM user_pament WHERE status = '${status}' ORDER BY id DESC LIMIT 1`,
        { model: userPaymentPlansDB, mapToModel: true }
    );
    return <UserPaymentPlansDB | any>result[0];
}