import { configDotenv } from "dotenv";
import { app, server } from "./app.js";
import sequelize from "./config/database.js";
import swagger from "./config/swagger.js";

configDotenv();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected!");
        // await sequelize.sync({ alter: true });

        swagger(app);

        server.listen(parseInt(process.env.PORT) || 3000, "0.0.0.0", () =>
            console.log(`Server is running on port ${process.env.PORT || 3000}`)
        );
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

startServer();
