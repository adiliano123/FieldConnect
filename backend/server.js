require("dotenv").config();

const app = require("./src/app");
const db = require("./src/config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.query("SELECT 1");

        console.log("MySQL database connected successfully");

        app.listen(PORT, () => {
            console.log(`FieldConnect server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

startServer();