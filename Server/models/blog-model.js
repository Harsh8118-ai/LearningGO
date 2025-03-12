const { Schema, model } = require('mongoose');

const blogSchema = new Schema(
  {
    username: { type: String, required: true }, // Match frontend user
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: null }, // URL for blog image
    fileId: { type: String, default: null }, // Optional file reference
  },
  { timestamps: true } // Auto-generates `createdAt` and `updatedAt`
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;
