import dbData from "db.json";
import { Sequelize } from "sequelize";

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