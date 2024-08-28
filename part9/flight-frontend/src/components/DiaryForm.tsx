import { Diary } from "../types";

const DiaryForm = ({
  newDiary,
  setNewDiary,
  createDiary,
}: {
  newDiary: Diary;
  setNewDiary: React.Dispatch<React.SetStateAction<Diary>>;
  createDiary: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <form onSubmit={createDiary}>
      <h2>Add a new diary entry</h2>
      <label htmlFor="date">Date: </label>
      <input
        type="date"
        min="2020-01-01"
        max="2030-12-31"
        value={newDiary.date}
        onChange={(e) => setNewDiary({ ...newDiary, date: e.target.value })}
      />
      <br />
      <label htmlFor="weather">Weather: </label>
      <label htmlFor="sunny">
        sunny
        <input
          type="radio"
          id="sunny"
          name="weather"
          value="sunny"
          checked={newDiary.weather === "sunny"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, weather: e.target.value })
          }
        />
      </label>
      <label htmlFor="rainy">
        rainy
        <input
          type="radio"
          id="rainy"
          name="weather"
          value="rainy"
          checked={newDiary.weather === "rainy"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, weather: e.target.value })
          }
        />
      </label>
      <label htmlFor="cloudy">
        cloudy
        <input
          type="radio"
          id="cloudy"
          name="weather"
          value="cloudy"
          checked={newDiary.weather === "cloudy"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, weather: e.target.value })
          }
        />
      </label>
      <label htmlFor="stormy">
        stormy
        <input
          type="radio"
          id="stormy"
          name="weather"
          value="stormy"
          checked={newDiary.weather === "stormy"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, weather: e.target.value })
          }
        />
      </label>
      <label htmlFor="windy">
        windy
        <input
          type="radio"
          id="windy"
          name="weather"
          value="windy"
          checked={newDiary.weather === "windy"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, weather: e.target.value })
          }
        />
      </label>
      <br />
      <label htmlFor="visibility">Visibility: </label>
      <label htmlFor="great">
        great
        <input
          type="radio"
          id="great"
          name="visibility"
          value="great"
          checked={newDiary.visibility === "great"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, visibility: e.target.value })
          }
        />
      </label>
      <label htmlFor="good">
        good
        <input
          type="radio"
          id="good"
          name="visibility"
          value="good"
          checked={newDiary.visibility === "good"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, visibility: e.target.value })
          }
        />
      </label>
      <label htmlFor="ok">
        ok
        <input
          type="radio"
          id="ok"
          name="visibility"
          value="ok"
          checked={newDiary.visibility === "ok"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, visibility: e.target.value })
          }
        />
      </label>
      <label htmlFor="poor">
        poor
        <input
          type="radio"
          id="poor"
          name="visibility"
          value="poor"
          checked={newDiary.visibility === "poor"}
          onChange={(e) =>
            setNewDiary({ ...newDiary, visibility: e.target.value })
          }
        />
      </label>
      <br />
      <label htmlFor="comment">Comment: </label>
      <input
        type="text"
        value={newDiary.comment || ""}
        onChange={(e) => setNewDiary({ ...newDiary, comment: e.target.value })}
      />
      <br />
      <button type="submit">Add</button>
    </form>
  );
};

export default DiaryForm;
