
const express = require("express");
const router = express.Router();

const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const protect = require("../middleware/authMiddleware");

// PUBLIC ROUTES

// Get all blogs
router.get("/", getAllBlogs);

// Get single blog
router.get("/:id", getBlogById);

// PROTECTED ROUTES

// Create blog
router.post("/", protect, createBlog);

// Update blog
router.put("/:id", protect, updateBlog);

// Delete blog
router.delete("/:id", protect, deleteBlog);

module.exports = router;
