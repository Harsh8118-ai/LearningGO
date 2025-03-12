const Blog = require("../models/blog-model");
const imagekit = require("../utils/imagekitConfig");

// Function to upload image to ImageKit
const uploadImage = async (fileBuffer, fileName) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: "/blog-images",
    });
    return result.url;
  } catch (error) {
    console.error("Image Upload Error:", error);
    return null;
  }
};

// Create a new blog (Fixed Image Upload Handling)
const createBlog = async (req, res) => {
  try {
    const { title, content, username } = req.body;
    
    if (!title || !content || !username) {
      return res.status(400).json({ message: "Title, content, and username are required" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, req.file.originalname);
    }

    const newBlog = await Blog.create({
      title,
      content,
      username,
      image: imageUrl, // Store uploaded image URL or null if not uploaded
    });

    return res.status(201).json({ message: "Blog posted successfully", newBlog });
  } catch (error) {
    console.error("Error posting blog:", error);
    return res.status(500).json({ message: "Error posting blog", error: error.message });
  }
};

// Retrieve all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({ message: "Error fetching blogs", error: error.message });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error.message);
    res.status(500).json({ message: "Error fetching blog", error: error.message });
  }
};

// Update a blog (Fixed Image Upload Handling)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    let imageUrl = blog.image; // Keep existing image if no new image is uploaded
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, req.file.originalname);
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = imageUrl;

    const updatedBlog = await blog.save();
    res.json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error.message);
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await Blog.findByIdAndDelete(id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};

// Export all functions
module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
