import axios from "axios";
import { Diary, NewDiary } from "./types";

const baseUrl = "http://localhost:3001/api/diaries";

export const getAll = async () => {
  return axios.get<Diary[]>(baseUrl).then((response) => response.data);
};

export const create = async (object: NewDiary) => {
  try {
    const response = await axios.post<Diary>(baseUrl, object);
    return response.data;
  } catch (error) {
    console.log("Error in service: ", error);
    throw error;
  }
};
