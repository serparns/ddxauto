import { DataTypes } from "sequelize";
import { db } from "utils/dbConnect";

export interface GroupTrainingTimeTablesDB {
    id: number;
    group_training_id: number;
    club_id: number;
    start_time: string;
    end_time: string;
    is_payable: boolean;
    is_deleted: boolean;
    config_settings_id: number;
    queue_available: boolean;
    club_zone_id: number;
    created_at: string;
    updated_at: string;
    parent_id: number;
    queue_limit: number;
    booking_start_at: string
    booking_end_at: string;
    count_seats: number;
    club_start_time: string;
    club_end_time: string;
}

export const groupTrainingTimeTablesDB = db.define(
    'group_training_time_tables',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        group_training_id: { type: DataTypes.BIGINT },
        club_id: { type: DataTypes.BIGINT },
        start_time: { type: DataTypes.STRING },
        end_time: { type: DataTypes.STRING },
        is_payable: { type: DataTypes.BOOLEAN },
        is_deleted: { type: DataTypes.BOOLEAN },
        config_settings_id: { type: DataTypes.BIGINT },
        queue_available: { type: DataTypes.BOOLEAN },
        club_zone_id: { type: DataTypes.BIGINT },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
        parent_id: { type: DataTypes.BIGINT },
        queue_limit: { type: DataTypes.NUMBER },
        booking_start_at: { type: DataTypes.TIME },
        booking_end_at: { type: DataTypes.TIME },
        count_seats: { type: DataTypes.NUMBER },
        club_start_time: { type: DataTypes.STRING },
        club_end_time: { type: DataTypes.STRING },
    },
    {
        timestamps: false
    }
)

export async function selectByTrarningId(groupTrainingTimeTableId: number): Promise<GroupTrainingTimeTablesDB> {
    const result = await db.query(
        `SELECT * FROM group_training_time_tables WHERE id = ${groupTrainingTimeTableId}  ORDER BY id DESC`,
        { model: groupTrainingTimeTablesDB, mapToModel: true });
    return <GroupTrainingTimeTablesDB | any>result[0];
}