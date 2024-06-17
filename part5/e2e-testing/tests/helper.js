const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "login" }).click();
  const textboxes = await page.getByRole("textbox").all();
  await textboxes[0].fill(username);
  await textboxes[1].fill(password);

  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole("button", { name: "Add Blog" }).click();
  await page.getByLabel("title").fill(title);
  await page.getByLabel("author").fill(author);
  await page.getByLabel("url").fill(url);
  await page.getByText("Submit").click();
  await page.getByText(`${title} - author: ${author}`).waitFor();
};

export { loginWith, createBlog };
