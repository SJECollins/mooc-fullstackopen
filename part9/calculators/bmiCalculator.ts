interface Result {
  heightCm: number;
  weightKg: number;
}

export const parseBmiArguments = (height: number, weight: number): Result => {
  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Provided values were not numbers!");
  }
  return {
    heightCm: height,
    weightKg: weight,
  };
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / Math.pow(height / 100, 2);
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal range";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
};

try {
  const { heightCm, weightKg } = parseBmiArguments(
    Number(process.argv[2]),
    Number(process.argv[3])
  );
  console.log(calculateBmi(heightCm, weightKg));
} catch (error: unknown) {
  let errorMessage = "There was an error.";
  if (error instanceof Error) {
    errorMessage = "Error: " + error.message;
  }
  console.log(errorMessage);
}
