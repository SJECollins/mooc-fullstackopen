interface inputValues {
  targetAmount: number;
  dailyHours: Array<number>;
}

interface Result {
  numberOfDays: number;
  numberOfTrainingDays: number;
  originalTarget: number;
  averageTime: number;
  targetReached: boolean;
  rating: number;
  ratingDescription: string;
}

export const parseExerciseArguments = (
  targetAmount: number,
  dailyHours: Array<number>
): inputValues => {
  if (dailyHours.length < 1) throw new Error("Not enough arguments");
  if (!isNaN(targetAmount) && dailyHours.every((hour) => !isNaN(hour))) {
    return {
      dailyHours,
      targetAmount: targetAmount,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercises = (
  targetAmount: number,
  dailyHours: Array<number>
): Result => {
  const numberOfDays = dailyHours.length;
  const numberOfTrainingDays = dailyHours.filter((hour) => hour > 0).length;
  const originalTarget = targetAmount;
  const averageTime =
    dailyHours.reduce((acc, curr) => acc + curr, 0) / numberOfDays;
  let targetReached = false;
  let rating = 1;
  let ratingDescription = "You missed the target";
  if (averageTime > targetAmount) {
    targetReached = true;
    rating = 3;
    ratingDescription = "You exceeded the target";
  } else if (averageTime === targetAmount) {
    targetReached = true;
    rating = 2;
    ratingDescription = "You reached the target";
  }
  return {
    numberOfDays,
    numberOfTrainingDays,
    originalTarget,
    averageTime,
    targetReached,
    rating,
    ratingDescription,
  };
};

try {
  const target = Number(process.argv[2]);
  const hours = process.argv.slice(3).map((hour) => Number(hour));
  const { targetAmount, dailyHours } = parseExerciseArguments(target, hours);
  console.log(calculateExercises(targetAmount, dailyHours));
} catch (error) {
  let errorMessage = "There was an error.";
  if (error instanceof Error) {
    errorMessage = "Error: " + error.message;
  }
  console.log(errorMessage);
}
