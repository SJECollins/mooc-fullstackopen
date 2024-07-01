import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((a) => a.id === id);
      const newAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };
      return state.map((a) => (a.id !== id ? a : newAnecdote));
    },
    appendAnecdote(state, action) {
      return state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const newAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createAnecdote(content);
    dispatch(appendAnecdote(anecdote));
  };
};

export const addVote = (anecdoteId) => {
  return async (dispatch) => {
    await anecdoteService.voteForAnecdote(anecdoteId);
    dispatch(vote(anecdoteId));
  };
};

export default anecdoteSlice.reducer;
