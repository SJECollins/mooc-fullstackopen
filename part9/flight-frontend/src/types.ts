export interface Diary {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

export type NewDiary = Omit<Diary, "id">;

// Could have a DiaryFormProps type here and use React.FC<DiaryFormProps> in DiaryForm.tsx
// interface DiaryFormProps {
//     newDiary: Diary;
//     setNewDiary: React.Dispatch<React.SetStateAction<Diary>>;
//     createDiary: (event: React.FormEvent<HTMLFormElement>) => void;
//   }
