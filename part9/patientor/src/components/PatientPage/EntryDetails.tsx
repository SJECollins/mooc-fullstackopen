import { EntryDetailsProps } from "../../types";
import HospitalEntry from "./HospitalEntry";
import OccupationalHealthcareEntry from "./OccupationalHealthcareEntry";
import HealthCheckEntry from "./HealthCheckEntry";

const EntryDetails: React.FC<EntryDetailsProps> = ({
  entry,
  diagnosisCodes,
}) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} diagnosisCodes={diagnosisCodes} />;
    case "OccupationalHealthcare":
      return (
        <OccupationalHealthcareEntry
          entry={entry}
          diagnosisCodes={diagnosisCodes}
        />
      );
    case "Hospital":
      return <HospitalEntry entry={entry} diagnosisCodes={diagnosisCodes} />;
    default:
      return assertNever(entry);
  }
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default EntryDetails;
