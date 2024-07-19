import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"

test("renders title and author, not likes or url", () => {
  const blog = {
    title: "Test title",
    author: "Me",
    url: "https://blog.com",
    likes: 10,
    user: {},
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText("Test title - author: Me")
  expect(element).toBeDefined()

  const { container } = render(<Blog blog={blog} />)

  const likes = container.querySelector(".likes")
  expect(likes).toEqual(null)

  const url = container.querySelector(".url")
  expect(url).toEqual(null)
})

test("renders likes or url after clicking view", async () => {
  const blog = {
    title: "Test title",
    author: "Me",
    url: "https://blog.com",
    likes: 10,
    user: {},
  }

  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} />)

  const view = screen.getByText("view")
  await user.click(view)

  const likes = container.querySelector(".likes")
  expect(likes).toBeDefined()

  const url = container.querySelector(".url")
  expect(url).toBeDefined
})

test("view button clicks are handled", async () => {
  const blog = {
    title: "Test title",
    author: "Me",
    url: "https://blog.com",
    likes: 10,
    user: {},
  }

  const user = userEvent.setup()
  const updateBlog = vi.fn()
  render(<Blog blog={blog} updateBlog={updateBlog} />)
  const view = screen.getByText("view")
  await user.click(view)

  const likeButton = screen.getByText("Like")
  await user.click(likeButton)
  await user.click(likeButton)
  expect(updateBlog).toHaveBeenCalledTimes(2)
})
