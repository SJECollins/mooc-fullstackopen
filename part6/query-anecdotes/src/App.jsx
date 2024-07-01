import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, voteForAnecdote } from "./requests";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const queryClient = useQueryClient();

  const voteForAnecdoteMutation = useMutation({
    mutationFn: voteForAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      const updatedAnecdotes = anecdotes.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      );
      queryClient.setQueryData(["anecdotes"], updatedAnecdotes);
    },
  });

  const handleVote = (anecdote) => {
    voteForAnecdoteMutation.mutate(anecdote.id);
  };

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  if (result.isPending) {
    return <div>loading...</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes?.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
