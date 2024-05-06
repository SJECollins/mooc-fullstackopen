const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercise}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      {props.part.map((part, index) => (
        <Part key={index} part={part.name} exercise={part.exercises} />
      ))}
    </div>
  );
};

const Total = (props) => {
  const total = props.total.reduce((acc, cur) => acc + cur.exercises, 0);
  return <p>Total of {total} exercises</p>;
};

const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content part={props.course.parts} />
      <Total total={props.course.parts} />
    </div>
  );
};

export default Course;
