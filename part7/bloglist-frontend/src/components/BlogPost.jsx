import { useParams } from "react-router-dom"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useCurrentUser } from "../contexts/CurrentUserContext"
import { useNotification } from "../contexts/NotificationContext"
import blogService from "../services/blogs"
import Comment from "./Comment"
import CommentForm from "./CommentForm"
import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material"

const BlogPost = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const user = useCurrentUser()

  const { dispatch } = useNotification()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogs", id],
    queryFn: ({ queryKey }) => blogService.getOne(queryKey[1]),
    refetchOnWindowFocus: false,
    retry: 1
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onMutate: async (blog) => {
      await queryClient.cancelQueries(["blogs", id])
      const previousBlog = queryClient.getQueryData(["blogs", id])
      queryClient.setQueryData(["blogs", id], {
        ...previousBlog,
        likes: blog.likes + 1
      })
      return { previousBlog }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["blogs"], context.previousBlog)
      dispatch("Failed to add vote")
    },
    onSettled: () => {
      queryClient.invalidateQueries(["blogs"])
      dispatch("Vote added")
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  const blog = data
  const comments = blog.comments || []

  const addLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    updateBlogMutation.mutate(updatedBlog)
  }

  const deleteBlog = async () => {
    try {
      if (window.confirm(`Remove blog: ${blog.title}?`)) {
        await blogService.deleteBlog(blog.id)
        queryClient.invalidateQueries(["blogs"])
        dispatch("Blog deleted")
      }
    } catch (error) {
      dispatch("Failed to delete blog")
    }
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes <Button onClick={addLike}>like</Button>
      </p>
      <em>added by {blog.author}</em>
      {blog.user.id === user.id && <Button onClick={deleteBlog}>remove</Button>}

      <CommentForm />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Comments:</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <Comment comment={comment.comment} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No comments yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogPost
