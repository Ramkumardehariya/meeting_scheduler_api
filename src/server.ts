import { app } from "./app";
import { sequelize } from "./config/database";
require("dotenv").config();

const PORT= process.env.PORT || 4000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Databse connection successfull");

        await sequelize.sync();
        console.log("Database synced");

        app.listen(PORT, () => {
            console.log(`Server is running on PORT no. ${PORT}`);
        })
    } catch (error) {
        console.log("failed to startServer");
    }
}

startServer();