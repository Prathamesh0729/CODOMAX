
const mongoose = require("mongoose");
const Blog = require("../models/Blog");

// CREATE BLOG
const createBlog = async (req, res) => {
    try {
        const { title, content, category, image, status } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        if (status && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be draft or published."
            });
        }

        const blog = await Blog.create({
            title,
            content,
            category,
            image,
            status: status || "published",
            author: req.user._id
        });

        const populatedBlog = await Blog.findById(blog._id)
            .populate("author", "name email");

        return res.status(201).json({
            success: true,
            message: "Blog created successfully.",
            blog: populatedBlog
        });
    } catch (error) {
        console.error("Create blog error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating blog."
        });
    }
};

// GET ALL PUBLISHED BLOGS (PUBLIC)
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({
            $or: [
                { status: "published" },
                { status: { $exists: false } }
            ]
        })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });
    } catch (error) {
        console.error("Get all blogs error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching blogs."
        });
    }
};

// GET LOGGED-IN USER'S BLOGS (DRAFTS + PUBLISHED)
const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({
            author: req.user._id
        })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });
    } catch (error) {
        console.error("Get my blogs error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching your blogs."
        });
    }
};

// GET SINGLE PUBLISHED BLOG (PUBLIC)
const getBlogById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID."
            });
        }

        const blog = await Blog.findOne({
            _id: req.params.id,
            $or: [
                { status: "published" },
                { status: { $exists: false } }
            ]
        }).populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Published blog not found."
            });
        }

        return res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.error("Get blog by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching blog."
        });
    }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
    try {
        const { title, content, category, image, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID."
            });
        }

        if (status !== undefined && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be draft or published."
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found."
            });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog."
            });
        }

        if (title !== undefined) blog.title = title;
        if (content !== undefined) blog.content = content;
        if (category !== undefined) blog.category = category;
        if (image !== undefined) blog.image = image;
        if (status !== undefined) blog.status = status;

        await blog.save();

        const updatedBlog = await Blog.findById(blog._id)
            .populate("author", "name email");

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully.",
            blog: updatedBlog
        });
    } catch (error) {
        console.error("Update blog error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating blog."
        });
    }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID."
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found."
            });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog."
            });
        }

        await blog.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully."
        });
    } catch (error) {
        console.error("Delete blog error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting blog."
        });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
