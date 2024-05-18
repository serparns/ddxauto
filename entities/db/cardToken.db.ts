import { DataTypes } from "sequelize";
import { db } from "utils/dbConnect";

export interface CardTokensDB {
    id: number;
    user_id: number;
    payment_service_id: number;
    token: string;
    public_card_number: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export const cardTokensDB = db.define(
    'card_tokens',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        user_id: { type: DataTypes.BIGINT },
        payment_service_id: { type: DataTypes.BIGINT },
        token: { type: DataTypes.STRING },
        public_card_number: { type: DataTypes.STRING },
        is_deleted: { type: DataTypes.BOOLEAN },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
    },
    {
        timestamps: false
    }
)

export async function selectUserIdFromCardTokens(): Promise<CardTokensDB> {
    const result = await db.query(
        `SELECT user_id FROM  card_tokens WHERE is_deleted = false ORDER BY id DESC LIMIT 1`,
        { model: cardTokensDB, mapToModel: true });
    return <CardTokensDB | any>result[0];
}

export async function selectCountFromCardTokens(userId: number): Promise<Array<CardTokensDB>> {
    const result = await db.query(
        `SELECT * FROM  card_tokens WHERE user_id = ${userId} and is_deleted = false ORDER BY id ASC`, { model: cardTokensDB, mapToModel: true });
    return <CardTokensDB | any>result;
}