import { v1 as uuid } from "uuid";
import patientData from "../../data/patients";
import { NonSensitivePatient, Patient, NewPatientEntry, Entry } from "../types";

const nonSensitivePatients: Array<NonSensitivePatient> = patientData.map(
  ({ ssn, ...rest }): NonSensitivePatient => ({
    ...rest,
  })
);

const getNonSensitivePatients = (): Array<NonSensitivePatient> => {
  return nonSensitivePatients;
};

const addPatient = (patient: NewPatientEntry): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patientData.push(newPatient);
  return newPatient;
};

const getPatient = (id: string): Patient | undefined => {
  return patientData.find((patient) => patient.id === id);
};

const addEntry = (entry: Entry, id: string): Entry => {
  const patient = patientData.find((p) => p.id === id);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const newEntry = { ...entry, id: uuid() };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addEntry,
};
