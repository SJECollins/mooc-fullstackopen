const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "This is the first blog",
    author: "Me",
    url: "http://www.blog.com",
    likes: 5,
    __v: 0,
  },
  {
    title: "This is the second blog",
    author: "Me",
    url: "http://www.blog.com",
    likes: 10,
    __v: 0,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ content: "???" });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
