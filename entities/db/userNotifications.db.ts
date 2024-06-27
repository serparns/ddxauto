import { DataTypes } from "sequelize";
import { db } from "utils/dbConnect";

export interface UserNotificationsDB {
    id: number;
    user_id: number;
    sending_type: string;
    send_at: string;
    notification_type: string;
    description: string;
    send_to: string;
    created_at: string;
    updated_at: string;
    notify_template_id: number;
    body: JSON;
};

export const userNotificationsDB = db.define(
    'user_notifications',
    {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        user_id: { type: DataTypes.BIGINT },
        sending_type: { type: DataTypes.STRING },
        send_at: { type: DataTypes.TIME },
        notification_type: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        send_to: { type: DataTypes.STRING },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
        notify_template_id: { type: DataTypes.BIGINT },
        body: { type: DataTypes.JSONB },
    },
    {
        timestamps: false
    }
)

export async function selectVerifyCode(sentTo: string): Promise<UserNotificationsDB> {
    const result = await db.query(`select body -> 'variables' -> 'code'  code from user_notifications  where send_to = '${sentTo}' order by id desc limit 1`,
        { model: userNotificationsDB, mapToModel: true });
    return <UserNotificationsDB | any>result[0];
};