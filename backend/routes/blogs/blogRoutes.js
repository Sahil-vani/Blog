const multer = require("multer");
const express = require("express");
const {
  allBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../../contollers/blogs/blogControllers");

const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//all blogs
router.get("/", protect, allBlogs);

//single blog
router.get("/:id", protect, getBlog);

//create blog
router.post("/", protect, upload.single("coverImage"), createBlog);

//update blog
router.put("/:id", protect, upload.single("coverImage"), updateBlog);

//delete blog
router.delete("/:id", protect, deleteBlog);

module.exports = router;
