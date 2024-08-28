import diagnosesData from "../../data/diagnoses";
import { Diagnosis } from "../types";

const diagnoses: Array<Diagnosis> = diagnosesData;

const getAll = (): Array<Diagnosis> => {
  return diagnoses;
};

export default { getAll };
