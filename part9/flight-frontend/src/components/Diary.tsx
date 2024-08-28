import { Diary } from "../types";

const DiaryDisplay = ({ diary }: { diary: Diary }) => {
  return (
    <div>
      <p>{diary.date}</p>
      <p>{diary.weather}</p>
      <p>{diary.visibility}</p>
    </div>
  );
};

export default DiaryDisplay;
