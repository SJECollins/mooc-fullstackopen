import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }
  return (
    <div>
      <h1>statistics</h1>

      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average / all} />
          <StatisticLine text="positive" value={positive + "%"} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleClick = (value) => {
    if (value === "good") {
      const newGood = good + 1;
      const newAll = all + 1;
      setGood(newGood);
      setAll(newAll);
      setAverage(average + 1);
      setPositive((newGood / newAll) * 100);
    } else if (value === "neutral") {
      const newAll = all + 1;
      setNeutral(neutral + 1);
      setAll(newAll);
      setAverage(average + 0);
      setPositive((good / newAll) * 100);
    } else if (value === "bad") {
      const newAll = all + 1;
      setBad(bad + 1);
      setAll(newAll);
      setAverage(average - 1);
      setPositive((good / newAll) * 100);
    }
  };

  return (
    <div>
      <h1>give feedback</h1>

      <div>
        <Button
          onClick={() => {
            handleClick("good");
          }}
          text="good"
        />
        <Button
          onClick={() => {
            handleClick("neutral");
          }}
          text="neutral"
        />
        <Button
          onClick={() => {
            handleClick("bad");
          }}
          text="bad"
        />
      </div>

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
