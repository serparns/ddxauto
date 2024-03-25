import { db } from "utils/dbConnect";
import { DataTypes } from "sequelize";

export interface GroupTrainingUsersDB {
    id: number;
    group_training_time_table_id: number;
    user_id: number;
    booking_status: string;
    created_at: string;
    updated_at: string;
}

export const groupTrainingUsersDB = db.define(
    'group_training_users',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        group_training_time_table_id: { type: DataTypes.BIGINT },
        user_id: { type: DataTypes.BIGINT },
        booking_status: { type: DataTypes.STRING },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
    },
    {
        timestamps: false
    }
)

export async function selectByUserIdGroupTrainingTimeTableId(groupTrainingTimeTableId: number): Promise<GroupTrainingUsersDB> {
    const result = await db.query(
        `SELECT * FROM  group_training_users WHERE bookingStatus = "booked" and  group_training_time_table_id = ${groupTrainingTimeTableId}`,
        { model: groupTrainingUsersDB, mapToModel: true });
    return <GroupTrainingUsersDB | any>result[0];
}// TODO Изменить и доработать запрос под требования