import { DataTypes } from "sequelize";
import { db } from "utils/dbConnect";

export interface GroupTrainingDB {
    id: number;
    name: string;
    group_training_category_id: number;
    desc: string;
    is_deleted: boolean;
    count_seats: number;
    created_at: string;
    updated_at: string;
    intensity: number;
    content: JSON;
    queue_limit: number;
    booking_start_threshold: number;
    booking_end_threshold: number;
    short_desc: string;
    total_duration: number;
}

export const groupTrainingDB = db.define(
    'group_trainings',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        name: { type: DataTypes.STRING },
        group_training_category_id: { type: DataTypes.BIGINT },
        desc: { type: DataTypes.STRING },
        is_deleted: { type: DataTypes.BOOLEAN },
        count_seats: { type: DataTypes.BIGINT },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
        intensity: { type: DataTypes.BIGINT },
        content: { type: DataTypes.JSON },
        queue_limit: { type: DataTypes.BIGINT },
        booking_start_threshold: { type: DataTypes.BIGINT },
        booking_end_threshold: { type: DataTypes.BIGINT },
        short_desc: { type: DataTypes.STRING },
        total_duration: { type: DataTypes.BIGINT },
    },
    {
        timestamps: false
    }
)

export async function selectNameGroupTraining(trainingId: number): Promise<GroupTrainingDB> {
    const result = await db.query(
        `SELECT * FROM  group_trainings WHERE id =  ${trainingId}`,
        { model: groupTrainingDB, mapToModel: true });
    return <GroupTrainingDB | any>result[0];
}