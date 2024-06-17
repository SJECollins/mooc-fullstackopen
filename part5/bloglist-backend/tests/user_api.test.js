const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secretpassword", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();
});

describe("When there is one user in db", () => {
  test("can create new user", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "secreterpassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

describe("when creating new users", () => {
  test("non-unique usernames will fail", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Will Fail",
      password: "secretestpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("expected `username` to be unique"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("usernames cannot be less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "me",
      name: "Will Fail",
      password: "verysecretpassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes(
        "is shorter than the minimum allowed length (3)"
      )
    );

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("passwords cannot be less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "Testy Tester",
      name: "Will Fail",
      password: "pw",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("Password must be at least 3 characters")
    );

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
