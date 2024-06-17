// Using built-in node:test library
const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when their are initial blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("The unique identifier property of a blog is id", async () => {
    const blogs = await Blog.find({});
    assert.ok(blogs[0].id, "The id property is defined");
  });

  test("a specific blog can be viewed", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-type", /application\/json/);

    assert.deepStrictEqual(resultBlog.body, blogToView);
  });
});

describe("adding a new blog", () => {
  let headers;

  beforeEach(async () => {
    const testUser = {
      username: "blogtestuser",
      name: "Blog Tester",
      password: process.env.TEST_PASSWORD,
    };

    await api.post("/api/users").send(testUser);

    const result = await api.post("/api/login").send(testUser);

    headers = { Authorization: `Bearer ${result.body.token}` };
  });

  test("a blog can be added", async () => {
    const newBlog = {
      title: "This is the third blog",
      author: "Me",
      url: "http://www.blog.com",
      likes: 5,
    };
    await api
      .post("/api/blogs")
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);

    assert(titles.includes("This is the third blog"));
  });

  test("likes defaults to 0 if likes property missing", async () => {
    const newBlog = {
      title: "This is the fourth blog",
      author: "Me",
      url: "http://www.blog.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find(
      (blog) => blog.title === "This is the fourth blog"
    );
    assert.strictEqual(addedBlog.likes, 0);
  });

  test("blog without author is not added", async () => {
    const newBlog = {
      title: "This will not be added",
      url: "http://www.blog.com",
      likes: 5,
    };

    await api.post("/api/blogs").set(headers).send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test("blog without url is not added", async () => {
    const newBlog = {
      title: "This will also not be added",
      author: "Me",
      likes: 5,
    };

    await api.post("/api/blogs").set(headers).send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe("when modifying blogs", () => {
  let headers;

  beforeEach(async () => {
    const testUser = {
      username: "blogtestuser",
      name: "Blog Tester",
      password: process.env.TEST_PASSWORD,
    };

    await api.post("/api/users").send(testUser);

    const result = await api.post("/api/login").send(testUser);

    headers = { Authorization: `Bearer ${result.body.token}` };
  });

  test("a blog can be updated", async () => {
    const newBlog = {
      title: "This blog will be updated",
      author: "Me",
      url: "http://blog.com",
      likes: 10,
    };

    await api.post("/api/blogs").set(headers).send(newBlog).expect(201);

    const allBlogs = await helper.blogsInDb();
    const blogToUpdate = allBlogs.find((blog) => blog.title === newBlog.title);

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfter = await helper.blogsInDb();
    const blogWasUpdated = blogsAfter.find(
      (blog) => blog.title === newBlog.title
    );
    assert.strictEqual(blogWasUpdated.likes, 11);
  });

  test("a blog can be deleted", async () => {
    const newBlog = {
      title: "This blog will be deleted",
      author: "Me",
      url: "http://blog.com",
      likes: 42,
    };

    await api.post("/api/blogs").send(newBlog).set(headers).expect(201);

    const blogsBefore = await helper.blogsInDb();
    const blogToDelete = blogsBefore.find(
      (blog) => blog.title === newBlog.title
    );

    await api.delete(`/api/blogs/${blogToDelete.id}`).set(headers).expect(204);
    const blogsAfter = await helper.blogsInDb();

    const titles = blogsAfter.map((blog) => blog.title);
    assert(!titles.includes(blogToDelete.title));

    assert.strictEqual(blogsAfter.length, blogsBefore.length - 1);
  });

  test("trying to delete if unauthorized returns 401", async () => {
    const allBlogs = await helper.blogsInDb();
    const blogToDelete = allBlogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: "Bearer nonsensetoken" })
      .expect(401);
  });
});

after(async () => {
  await mongoose.connection.close();
});
