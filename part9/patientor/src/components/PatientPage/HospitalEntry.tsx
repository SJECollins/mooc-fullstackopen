import { Entry, Diagnosis } from "../../types";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const HospitalEntry: React.FC<{
  entry: Entry;
  diagnosisCodes: Diagnosis[];
}> = ({ entry, diagnosisCodes }) => {
  if (entry.type !== "Hospital") {
    return null;
  }

  const getDiagnosisName = (code: string) => {
    const diagnosis = diagnosisCodes.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  return (
    <div>
      <Typography variant="subtitle1">{entry.date} - Hospital</Typography>
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
      <Typography>
        Discharge: {entry.discharge.date} - {entry.discharge.criteria}
      </Typography>
    </div>
  );
};

export default HospitalEntry;
