
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Registration
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile
router.get("/profile", protect, getProfile);

module.exports = router;
