const Blog = require("../../models/blogs/blogmodels");
const asyncHandler = require("express-async-handler");
const BlogUser = require("../../models/users/userModel");

//All blog
const allBlogs = asyncHandler(async (req, res) => {
  // get users id from jwt
  const user = await BlogUser.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found!");
  }

  const allBlogs = await Blog.find();

  if (!allBlogs) {
    res.status(404);
    throw new Error("No blogs found");
  }
  res.json(allBlogs);
});

// single blog
const getBlog = asyncHandler(async (req, res) => {
  // get users id from jwt
  const user = await BlogUser.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found!");
  }

  const singleBlog = await Blog.findById(req.params.id);

  if (!singleBlog) {
    res.status(404);
    res.json({
      msg: "No blog found",
    });
  }
  res.send(singleBlog);
});

// create blog
const createBlog = asyncHandler(async (req, res) => {
  const { title, description, isPublished, author } = req.body;
  const { path } = req.file ? req.file : "";
  if (!title || !description || !author || !isPublished) {
    res.status(400);
    res.json({
      msg: "please fill all details",
    });
  }

  // get users id from jwt
  const user = await BlogUser.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found!");
  }

  const newBlog = await Blog.create({
    title,
    description,
    isPublished,
    author,
    coverImage: path,
  });

  if (!newBlog) {
    res.status(401);
    res.json({
      msg: "Can Not Create Blog",
    });
  }

  res.status(201).send(newBlog);
});

// update blog
const updateBlog = asyncHandler(async (req, res) => {
  // get users id from jwt
  const user = await BlogUser.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found!");
  }

  if (!req.file == "undefined") {
    await Blog.findByIdAndUpdate(
      req.params.id,
      { coverImage: req.file.path },
      {
        new: true,
      }
    );
  }

  const updatingBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatingBlog) {
    res.status(400).json({ msg: "Blog Not Updated" });
  }
  const updatedBlog = await Blog.findById(req.params.id);
  res.status(200).send(updatedBlog);
});

// delete blog
const deleteBlog = asyncHandler(async (req, res) => {
  // get users id from jwt
  const user = await BlogUser.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found!");
  }

  const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

  if (!deletedBlog) {
    res.status(400).json({ msg: "Blog Not Deleted" });
  }

  res.status(200).json({ msg: "Blog Is Deleted" });
});

module.exports = {
  getBlog,
  allBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
