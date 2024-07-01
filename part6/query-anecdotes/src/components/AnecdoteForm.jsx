import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { useNotification } from "../contexts/NotificationContext";

const AnecdoteForm = () => {
  const dispatch = useNotification();

  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], [...anecdotes, newAnecdote]);
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        dispatch("too short anecdote, must have length 5 or more");
      }
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
    dispatch(`You added '${content}'`);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
