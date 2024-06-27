import { db } from "@utils/dbConnect";
import { DataTypes } from "sequelize";

export interface ClubsDB {
    id: number;
    name: string;
    short_name: string;
    city_id: number;
    cluster_id: number;
    club_type: string;
    postal_code: string;
    street: string;
    building_name: string;
    latitude: number;
    longitude: number;
    open_date: string;
    email: string;
    phone: string;
    open_hours: JSON;
    area_in_square_meters: number;
    capacity: number;
    close_period: JSON;
    is_deleted: boolean;
    is_hidden: boolean;
    created_at: string;
    updated_at: string;
    symbolic_code: string;
    default_payment_service_id: number;
    project_area: number;
    rounded_area: number;
    point_of_interest: JSON;
}

export const clubsDB = db.define(
    'clubs',
    {
        id: { type: DataTypes.NUMBER, primaryKey: true },
        name: { type: DataTypes.STRING },
        short_name: { type: DataTypes.STRING },
        city_id: { type: DataTypes.NUMBER },
        cluster_id: { type: DataTypes.NUMBER },
        club_type: { type: DataTypes.STRING },
        postal_code: { type: DataTypes.STRING },
        street: { type: DataTypes.STRING },
        building_name: { type: DataTypes.STRING },
        latitude: { type: DataTypes.NUMBER },
        longitude: { type: DataTypes.NUMBER },
        open_date: { type: DataTypes.TIME },
        email: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING },
        open_hours: { type: DataTypes.JSON },
        area_in_square_meters: { type: DataTypes.NUMBER },
        capacity: { type: DataTypes.NUMBER },
        close_period: { type: DataTypes.JSON },
        is_deleted: { type: DataTypes.BOOLEAN },
        is_hidden: { type: DataTypes.BOOLEAN },
        created_at: { type: DataTypes.TIME },
        updated_at: { type: DataTypes.TIME },
        symbolic_code: { type: DataTypes.STRING },
        default_payment_service_id: { type: DataTypes.NUMBER },
        project_area: { type: DataTypes.NUMBER },
        rounded_area: { type: DataTypes.NUMBER },
        point_of_interest: { type: DataTypes.JSON }
    },
    {
        timestamps: false
    }
)

export async function selectClubShortName(paymentServiceId: number): Promise<ClubsDB> {
    const result = await db.query(
        `select short_name from clubs where default_payment_service_id = ${paymentServiceId} and is_deleted = false order by id asc limit 1`,
        { model: clubsDB, mapToModel: true }
    );
    return <ClubsDB | any>result[0];
}
