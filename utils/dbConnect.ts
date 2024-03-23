import { Sequelize } from "sequelize";
import dbData from "db.json";

export const db = new Sequelize(
    dbData.test.name,
    dbData.test.username,
    dbData.test.password,
    {
        host: dbData.test.host,
        port: dbData.test.port,
        dialect: 'postgres'
    }
)