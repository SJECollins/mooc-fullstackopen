import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNotification } from "../contexts/NotificationContext"
import blogService from "../services/blogs"
import { Button, TextField } from "@mui/material"

const BlogForm = () => {
  const dispatch = useNotification()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"])
      queryClient.setQueryData(["blogs"], [...blogs, newBlog])
      dispatch(`You added '${newBlog.title}'`)
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        dispatch("error creating blog")
      }
      if (error.response?.status === 401) {
        dispatch("unauthorized")
      }
      if (error.response?.status === 403) {
        dispatch("forbidden")
      }
    }
  })

  const addBlog = (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    newBlogMutation.mutate({ title, author, url })
    event.target.title.value = ""
    event.target.author.value = ""
    event.target.url.value = ""
  }

  return (
    <div>
      <h2>Create new blog entry</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField label="Title" name="title" />
        </div>
        <div>
          <TextField label="Author" name="author" />
        </div>
        <div>
          <TextField label="Url" name="url" />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default BlogForm
