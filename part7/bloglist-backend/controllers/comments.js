const commentRouter = require("express").Router();
const Comment = require("../models/comment");
const Blog = require("../models/blog");

commentRouter.get("/:id/comments", async (request, response) => {
  const { id } = request.params;
  const comments = await Blog.findById(id).populate("comments");
  response.json(comments);
});

commentRouter.post("/:id/comments", async (request, response) => {
  const { id } = request.params;
  const { comment: body } = request.body;

  const blog = await Blog.findById(id);

  const newComment = new Comment({
    comment: body,
    blog: blog._id,
  });

  const savedComment = await newComment.save();
  blog.comments = blog.comments.concat(savedComment._id);
  await blog.save();

  const updatedBlog = await Blog.findById(id).populate("comments");
  response.status(201).json(updatedBlog);
});

module.exports = commentRouter;
