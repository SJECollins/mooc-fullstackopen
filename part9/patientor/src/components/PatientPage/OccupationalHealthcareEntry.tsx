import { Entry, Diagnosis } from "../../types";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const OccupationalHealthcareEntry: React.FC<{
  entry: Entry;
  diagnosisCodes: Diagnosis[];
}> = ({ entry, diagnosisCodes }) => {
  if (entry.type !== "OccupationalHealthcare") {
    return null;
  }

  const getDiagnosisName = (code: string) => {
    const diagnosis = diagnosisCodes.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  return (
    <div>
      <Typography variant="subtitle1">
        {entry.date} - Occupational Healthcare
      </Typography>
      <Typography>{entry.description}</Typography>
      <Typography>Specialist: {entry.specialist}</Typography>
      {entry.diagnosisCodes && (
        <List>
          {entry.diagnosisCodes.map((code) => (
            <ListItem key={code}>
              <ListItemText>
                {code} {getDiagnosisName(code)}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      )}
      <Typography>Employer: {entry.employerName}</Typography>
    </div>
  );
};

export default OccupationalHealthcareEntry;
