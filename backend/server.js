require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import configuration and routes
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

// Middleware
app.use(cors({
    origin: [
        "https://codomax-blogspace-bgz3.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/.*/, cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CODOMAX Blog API is running!"
    });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await connectDB();

        console.log("MongoDB connection established.");

        app.listen(PORT, () => {
            console.log(`CODOMAX API running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
