
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");

        // Safe diagnostic: never prints the actual connection string
        console.log(
            "MONGO_URI available:",
            Boolean(process.env.MONGO_URI)
        );

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is missing");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
