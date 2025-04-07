import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env" });

export const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        name: process.env.DB_NAME || "trellone",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
    },
    jwtSecret: process.env.JWT_SECRET || "thiisthemostsecuredkey",
};
