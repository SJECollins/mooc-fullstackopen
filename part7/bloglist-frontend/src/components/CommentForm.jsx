import { useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import commentService from "../services/comments"
import { Button, TextField } from "@mui/material"

const CommentForm = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const addCommentMutation = useMutation({
    mutationFn: ({ id, content }) => commentService.create(id, content),
    onMutate: async ({ id, content }) => {
      await queryClient.cancelQueries(["blogs", id])

      const previousBlog = queryClient.getQueryData(["blogs", id])
      const updatedBlog = {
        ...previousBlog,
        comments: [...previousBlog.comments, content]
      }

      queryClient.setQueryData(["blogs", id], updatedBlog)
      return { previousBlog }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["blogs", id], context.previousBlog)
    },
    onSettled: () => {
      queryClient.invalidateQueries(["blogs", id])
    }
  })

  const handleComment = (event) => {
    event.preventDefault()
    const content = event.target.comment.value
    try {
      addCommentMutation.mutate({ id, content })
      event.target.comment.value = ""
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleComment}>
      <TextField label="comment" id="comment" type="text" name="comment" />
      <Button type="submit">add comment</Button>
    </form>
  )
}

export default CommentForm
