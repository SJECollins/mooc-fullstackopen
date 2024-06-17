const { describe, test, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Test User",
        username: "testuser",
        password: "somepassword",
      },
    });

    await page.goto("http://localhost:5173");
  });
  test("front page can be opened", async ({ page }) => {
    const locator = await page.getByText("Blog app");
    await expect(locator).toBeVisible();
    await expect(page.getByText("Blog app")).toBeVisible();
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("button", { name: "login" }).click();
      const textboxes = await page.getByRole("textbox").all();
      await textboxes[0].fill("testuser");
      await textboxes[1].fill("somepassword");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Logged in successfully!")).toBeVisible();
    });

    test("fails with incorrect credentials", async ({ page }) => {
      await page.getByRole("button", { name: "login" }).click();
      const textboxes = await page.getByRole("textbox").all();
      await textboxes[0].fill("testuser");
      await textboxes[1].fill("wrongpassword");

      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "testuser", "somepassword");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "testing submit", "me", "http://blog.com");
      await expect(page.getByText("testing submit - author: me")).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "testing content", "me", "http://blog.com");
      });
      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByText("likes 0")).toBeVisible();
        await page.getByRole("button", { name: "Like" }).click();
        await expect(page.getByText("Liked testing content!")).toBeVisible();
      });

      test("only owner can see remove button", async ({ page, request }) => {
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByText("Remove")).toBeVisible();

        await page.getByRole("button", { name: "logout" }).click();
        await request.post("http://localhost:3003/api/users", {
          data: {
            name: "Test OtherUser",
            username: "testotheruser",
            password: "someotherpassword",
          },
        });
        await loginWith(page, "testotheruser", "someotherpassword");

        await expect(page.getByText("Remove")).not.toBeVisible();
      });
    });
    describe("and multiple blogs exist", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "first", "me", "http://blog.com");
        await createBlog(page, "second", "me", "http://blog.com");
      });
      test("blogs are arranged in order of likes", async ({ page }) => {
        const blogs = await page.$$(".blog");
        expect(blogs.length).toBeGreaterThanOrEqual(2);

        if (blogs.length >= 2) {
          const titles = await Promise.all(
            blogs.map((blog) =>
              blog.$eval(".title-author", (node) => node.textContent.trim())
            )
          );

          expect(titles[0]).toBe("first - author: me");

          const secondBlog = blogs[1];
          const viewBtn = await secondBlog.$(".visibility-btn");
          await viewBtn.click();
          const likeBtn = await secondBlog.$(".like-btn");
          await likeBtn.click();

          const updatedBlogs = await page.$$(".blog");
          const updatedTitles = await Promise.all(
            updatedBlogs.map((blog) =>
              blog.$eval(".title-author", (node) => node.textContent.trim())
            )
          );

          expect(updatedTitles.indexOf("first - author: me")).toBeLessThan(
            updatedTitles.indexOf("second - author: me")
          );
        }
      });
    });
  });
});
