import { Sequelize } from "sequelize";
import * as dotenv from "dotenv"
import { config } from "./config.js";

dotenv.config()

const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        dialect: "mysql",
        port: parseInt(config.database.port, 10)
    }
)

export default sequelize