import { DataTypes } from "sequelize";
import { db } from "utils/dbConnect";

export interface NotesDB {
    id: number;
    text: string;
    type: string;
    user_id: number;
    employee_id: number;
    created_at: string;
    updated_at: string;
}

export const notesDB = db.define(
    'notes',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        text: { type: DataTypes.STRING },
        type: { type: DataTypes.STRING },
        user_id: { type: DataTypes.BIGINT },
        employee_id: { type: DataTypes.BIGINT },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
    },
    {
        timestamps: false
    }
)

export async function selectNotesData(userId: number): Promise<NotesDB> {
    const result = await db.query(
        `SELECT * FROM  notes WHERE user_id = ${userId} ORDER BY id DESC LIMIT 1`,
        { model: notesDB, mapToModel: true });
    return <NotesDB | any>result[0];
}