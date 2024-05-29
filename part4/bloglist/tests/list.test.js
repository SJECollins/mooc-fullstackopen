// Using built-in node:test library
const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { url } = require("node:inspector");

const listWithOneBlog = [
  {
    _id: "5a422a851",
    title: "This is the only blog",
    author: "Me",
    url: "http://www.blog.com",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "5a422a851",
    title: "This is the first blog",
    author: "Me",
    url: "http://www.blog.com",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422a852",
    title: "This is the second blog",
    author: "Me",
    url: "http://www.blog.com",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422a853",
    title: "This is the third blog",
    author: "Me",
    url: "http://www.blog.com",
    likes: 15,
    __v: 0,
  },
  {
    _id: "5a422a854",
    title: "This is the fourth blog",
    author: "You",
    url: "http://www.blog.com",
    likes: 0,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });
  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 30);
  });
});

describe("favorite blog", () => {
  test("has the most likes", () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);
    assert.deepStrictEqual(result, {
      _id: "5a422a853",
      title: "This is the third blog",
      author: "Me",
      url: "http://www.blog.com",
      likes: 15,
      __v: 0,
    });
  });
});

describe("most blogs", () => {
  test("has the most blogs", () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs);
    assert.deepStrictEqual(result, {
      author: "Me",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("has the most likes", () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs);
    assert.deepStrictEqual(result, {
      author: "Me",
      likes: 30,
    });
  });
});
