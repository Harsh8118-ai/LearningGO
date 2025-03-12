const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog-controllers");
const multer = require("multer");

const storage = multer.memoryStorage(); // Store images in memory before upload
const upload = multer({ storage });

router.post("/", upload.single("image"), blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", upload.single("image"), blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
