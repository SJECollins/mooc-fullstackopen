import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data);

export const createAnecdote = (newAnecdote) =>
  axios.post(baseUrl, newAnecdote).then((res) => res.data);

export const voteForAnecdote = (id) =>
  axios.get(`${baseUrl}/${id}`).then((res) => {
    const updatedAnecdote = { ...res.data, votes: res.data.votes + 1 };
    return axios
      .put(`${baseUrl}/${id}`, updatedAnecdote)
      .then((res) => res.data);
  });
