import {
  NewPatientEntry,
  Gender,
  Entry,
  HealthCheckRating,
  Diagnosis,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
} from "./types";

// Helper functions for type checks
const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name: " + name);
  }
  return name;
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseSSN = (ssn: any): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error("Incorrect or missing ssn: " + ssn);
  }
  return ssn;
};

const parseGender = (gender: any): Gender => {
  if (!isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Incorrect or missing occupation: " + occupation);
  }
  return occupation;
};

const parseDiagnosisCodes = (object: any): Array<Diagnosis["code"]> => {
  if (!object || !Array.isArray(object)) {
    return [] as Array<Diagnosis["code"]>;
  }
  if (!object.every((code: any) => isString(code))) {
    throw new Error("Invalid diagnosis codes");
  }
  return object;
};

const parseDescription = (description: any): string => {
  if (!description || !isString(description)) {
    throw new Error("Incorrect or missing description: " + description);
  }
  return description;
};

const parseSpecialist = (specialist: any): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("Incorrect or missing specialist: " + specialist);
  }
  return specialist;
};

const parseHealthCheckEntry = (entry: any): HealthCheckEntry => {
  if (!isHealthCheckRating(entry.healthCheckRating)) {
    throw new Error("Invalid or missing healthCheckRating");
  }

  return {
    id: entry.id,
    description: parseDescription(entry.description),
    date: parseDate(entry.date),
    specialist: parseSpecialist(entry.specialist),
    diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
    type: "HealthCheck",
    healthCheckRating: entry.healthCheckRating,
  };
};

const parseOccupationalHealthcareEntry = (
  entry: any
): OccupationalHealthcareEntry => {
  if (!entry.employerName || !isString(entry.employerName)) {
    throw new Error("Invalid or missing employerName");
  }

  return {
    id: entry.id,
    description: parseDescription(entry.description),
    date: parseDate(entry.date),
    specialist: parseSpecialist(entry.specialist),
    diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
    type: "OccupationalHealthcare",
    employerName: entry.employerName,
    sickLeave: entry.sickLeave
      ? {
          startDate: parseDate(entry.sickLeave.startDate),
          endDate: parseDate(entry.sickLeave.endDate),
        }
      : undefined,
  };
};

const parseHospitalEntry = (entry: any): HospitalEntry => {
  if (
    !entry.discharge ||
    !isString(entry.discharge.date) ||
    !isString(entry.discharge.criteria)
  ) {
    throw new Error("Invalid or missing discharge information");
  }

  return {
    id: entry.id,
    description: parseDescription(entry.description),
    date: parseDate(entry.date),
    specialist: parseSpecialist(entry.specialist),
    diagnosisCodes: parseDiagnosisCodes(entry.diagnosisCodes),
    type: "Hospital",
    discharge: {
      date: parseDate(entry.discharge.date),
      criteria: entry.discharge.criteria,
    },
  };
};

const parseEntry = (entry: any): Entry => {
  if (!entry || typeof entry !== "object") {
    throw new Error("Invalid entry");
  }

  switch (entry.type) {
    case "HealthCheck":
      return parseHealthCheckEntry(entry);
    case "OccupationalHealthcare":
      return parseOccupationalHealthcareEntry(entry);
    case "Hospital":
      return parseHospitalEntry(entry);
    default:
      throw new Error(`Invalid or missing entry type: ${entry.type}`);
  }
};

const addNewPatientEntry = (object: any): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  const newPatient: NewPatientEntry = {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: object.entries ? object.entries.map(parseEntry) : [],
  };

  return newPatient;
};

const addNewEntry = (object: any): Entry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  return parseEntry(object);
};

export default { addNewPatientEntry, addNewEntry };
