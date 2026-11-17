
const Blog = require("../models/Blog");

// CREATE BLOG
const createBlog = async (req, res) => {
    try {
        const { title, content, category, image } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const blog = await Blog.create({
            title,
            content,
            category,
            image,
            author: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        console.error("Create blog error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while creating blog"
        });
    }
};

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });

    } catch (error) {
        console.error("Get blogs error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching blogs"
        });
    }
};

// GET SINGLE BLOG
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        return res.status(200).json({
            success: true,
            blog
        });

    } catch (error) {
        console.error("Get blog error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching blog"
        });
    }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
    try {
        const { title, content, category, image } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check blog ownership
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog"
            });
        }

        if (title !== undefined) blog.title = title;
        if (content !== undefined) blog.content = content;
        if (category !== undefined) blog.category = category;
        if (image !== undefined) blog.image = image;

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {
        console.error("Update blog error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating blog"
        });
    }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check blog ownership
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog"
            });
        }

        await blog.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.error("Delete blog error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting blog"
        });
    }
};

// EXPORT ALL CONTROLLERS
module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
