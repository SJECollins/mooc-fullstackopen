import { useEffect, useState } from "react";
import "./App.css";
import { Diary } from "./types";
import { getAll, create } from "./diaryService";
import DiaryDisplay from "./components/Diary";
import DiaryForm from "./components/DiaryForm";
import axios from "axios";

function App() {
  useEffect(() => {
    getAll().then((data) => setDiaries(data));
  }, []);

  const [error, setError] = useState<string | null>(null);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [newDiary, setNewDiary] = useState<Diary>({
    id: 0,
    date: "",
    weather: "",
    visibility: "",
    comment: "",
  });

  const createDiary = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const diaryToAdd = {
        ...newDiary,
        id: Number(diaries.length + 1),
      };
      const data = await create(diaryToAdd);
      setDiaries(diaries.concat(data));
      setNewDiary({
        id: 0,
        date: "",
        weather: "",
        visibility: "",
        comment: "",
      });
    } catch (error) {
      console.log("Caught Error:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data;
        setError(`Error: ${errorMessage}`);
      } else {
        setError("Unknown error");
      }

      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <div>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      <DiaryForm
        newDiary={newDiary}
        setNewDiary={setNewDiary}
        createDiary={createDiary}
      />
      <h1>Flight Diary</h1>
      <ul>
        {diaries.map((diary) => (
          <DiaryDisplay key={diary.id} diary={diary} />
        ))}
      </ul>
    </div>
  );
}

export default App;
