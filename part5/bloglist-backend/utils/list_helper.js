var _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return favorite.likes > blog.likes ? favorite : blog;
  }, blogs[0]);
};

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, "author");
  const authorWithMostBlogs = _.maxBy(
    Object.keys(authorCounts),
    (author) => authorCounts[author]
  );
  return {
    author: authorWithMostBlogs,
    blogs: authorCounts[authorWithMostBlogs],
  };
};

const mostLikes = (blogs) => {
  const likesByAuthor = _.groupBy(blogs, "author");
  const authorWithMostLikes = _.maxBy(Object.keys(likesByAuthor), (author) =>
    totalLikes(likesByAuthor[author])
  );
  return {
    author: authorWithMostLikes,
    likes: totalLikes(likesByAuthor[authorWithMostLikes]),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
