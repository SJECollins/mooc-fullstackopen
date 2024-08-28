import Part from "./Part";
import { CoursePartProps } from "../types";

const Content: React.FC<CoursePartProps> = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map((part, i) => (
        <Part key={i} part={part} />
      ))}
    </div>
  );
};

export default Content;
