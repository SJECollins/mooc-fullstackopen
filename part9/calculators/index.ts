import express from "express";
import bodyParser from "body-parser";
import { parseBmiArguments, calculateBmi } from "./bmiCalculator";
import {
  parseExerciseArguments,
  calculateExercises,
} from "./exerciseCalculator";

const app = express();
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const weight = req.query.weight;
  const height = req.query.height;

  if (!weight || !height) {
    res.status(400);
    res.json({ error: "not enough parameters" });
  } else {
    try {
      const { heightCm, weightKg } = parseBmiArguments(
        Number(height),
        Number(weight)
      );
      const bmi = calculateBmi(heightCm, weightKg);
      res.json({ weight: weight, height: height, bmi: bmi });
    } catch (error) {
      res.status(400);
      res.json({ error: error.message });
    }
  }
});

app.post("/exercises", (req, res) => {
  const dailyExercises = req.body.daily_exercises;
  const target = req.body.target;

  if (!dailyExercises || !target) {
    res.status(400);
    res.json({ error: "parameters missing" });
  } else if (!Array.isArray(dailyExercises) || isNaN(Number(target))) {
    res.status(400);
    res.json({ error: "malformatted parameters" });
  } else {
    try {
      const { targetAmount, dailyHours } = parseExerciseArguments(
        target,
        dailyExercises
      );
      res.json(calculateExercises(targetAmount, dailyHours));
    } catch (error) {
      res.status(400);
      res.json({ error: error.message });
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
