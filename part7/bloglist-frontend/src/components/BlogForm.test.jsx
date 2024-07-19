import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText("Title:")
  const authorInput = screen.getByLabelText("Author:")
  const urlInput = screen.getByLabelText("Url:")
  const submitButton = screen.getByText("Submit")

  await user.type(titleInput, "test title")
  await user.type(authorInput, "me")
  await user.type(urlInput, "http://blog.com")
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls[0][0].title).toBe("test title")
})
