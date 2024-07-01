import { useSelector, useDispatch } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { updateNotification } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "") {
      return anecdotes;
    }
    const regex = new RegExp(filter, "i");
    return anecdotes.filter((anecdote) => anecdote.content.match(regex));
  });

  const vote = (id) => {
    dispatch(addVote(id));
    dispatch(updateNotification("Voted for anecdote", 5));
  };

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
