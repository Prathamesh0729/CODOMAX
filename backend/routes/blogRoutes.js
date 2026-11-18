
const express = require("express");
const router = express.Router();

const {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const protect = require("../middleware/authMiddleware");

// PUBLIC ROUTES

// Get all blogs
router.get("/", getAllBlogs);

// PROTECTED ROUTES

// Get only the logged-in user's blogs
router.get("/my-blogs", protect, getMyBlogs);

// Create blog
router.post("/", protect, createBlog);

// Update blog
router.put("/:id", protect, updateBlog);

// Delete blog
router.delete("/:id", protect, deleteBlog);

// Get single blog
router.get("/:id", getBlogById);

module.exports = router;
