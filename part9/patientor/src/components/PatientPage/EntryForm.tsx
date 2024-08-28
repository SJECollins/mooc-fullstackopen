import { useState, ChangeEvent, FormEvent } from "react";
import { Entry, HealthCheckRating, Diagnosis } from "../../types";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  ListItemText,
  Checkbox,
} from "@mui/material";

interface EntryFormProps {
  onSubmit: (values: Entry) => void;
  diagnosisCodes: Diagnosis[];
}

type EntryFormValues =
  | HealthCheckEntryFormValues
  | OccupationalHealthcareEntryFormValues
  | HospitalEntryFormValues;

interface BaseEntryFormValues {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: string[];
}

interface HealthCheckEntryFormValues extends BaseEntryFormValues {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntryFormValues extends BaseEntryFormValues {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

interface HospitalEntryFormValues extends BaseEntryFormValues {
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  };
}

const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, diagnosisCodes }) => {
  const [values, setValues] = useState<EntryFormValues>({
    type: "HealthCheck",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    healthCheckRating: HealthCheckRating.Healthy,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [key, subKey] = name.split(".");
    setValues((prev) => {
      if (prev.type === "OccupationalHealthcare" && key === "sickLeave") {
        return {
          ...prev,
          sickLeave: {
            ...prev.sickLeave,
            [subKey]: value,
          },
        } as OccupationalHealthcareEntryFormValues;
      } else if (prev.type === "Hospital" && key === "discharge") {
        return {
          ...prev,
          discharge: {
            ...prev.discharge,
            [subKey]: value,
          },
        } as HospitalEntryFormValues;
      }
      return prev;
    });
  };

  const handleTypeChange = (event: SelectChangeEvent<Entry["type"]>) => {
    const type = event.target.value as Entry["type"];
    let newValues: EntryFormValues;

    switch (type) {
      case "HealthCheck":
        newValues = {
          type,
          description: "",
          date: "",
          specialist: "",
          diagnosisCodes: [],
          healthCheckRating: HealthCheckRating.Healthy,
        };
        break;
      case "OccupationalHealthcare":
        newValues = {
          type,
          description: "",
          date: "",
          specialist: "",
          diagnosisCodes: [],
          employerName: "",
          sickLeave: {
            startDate: "",
            endDate: "",
          },
        };
        break;
      case "Hospital":
        newValues = {
          type,
          description: "",
          date: "",
          specialist: "",
          diagnosisCodes: [],
          discharge: {
            date: "",
            criteria: "",
          },
        };
        break;
      default:
        throw new Error("Invalid type");
    }

    setValues(newValues);
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const selectedCodes = event.target.value as string[];
    setValues((prev) => ({
      ...prev,
      diagnosisCodes: selectedCodes,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values as Entry);
  };
  console.log(diagnosisCodes);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select value={values.type} onChange={handleTypeChange} name="type">
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            Occupational Healthcare
          </MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Date"
        name="date"
        type="date"
        value={values.date}
        onChange={handleChange}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Specialist"
        name="specialist"
        value={values.specialist}
        onChange={handleChange}
        fullWidth
      />
      {values.type === "HealthCheck" && (
        <FormControl fullWidth>
          <InputLabel>Health Check Rating</InputLabel>
          <Select
            name="healthCheckRating"
            value={values.healthCheckRating}
            onChange={(e: SelectChangeEvent<HealthCheckRating>) => {
              setValues((prev) => ({
                ...prev,
                healthCheckRating: e.target.value as HealthCheckRating,
              }));
            }}
          >
            <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
            <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
            <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
            <MenuItem value={HealthCheckRating.CriticalRisk}>
              Critical Risk
            </MenuItem>
          </Select>
        </FormControl>
      )}
      <FormControl fullWidth>
        <InputLabel>Diagnosis Codes</InputLabel>
        <Select
          multiple
          value={values.diagnosisCodes}
          onChange={handleDiagnosisChange}
          renderValue={(selected) => selected.join(", ")}
        >
          {diagnosisCodes.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              <Checkbox
                checked={values.diagnosisCodes.includes(diagnosis.code)}
              />
              <ListItemText primary={`${diagnosis.code} - ${diagnosis.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {values.type === "OccupationalHealthcare" && (
        <>
          <TextField
            label="Employer Name"
            name="employerName"
            value={values.employerName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Sick Leave Start Date"
            name="sickLeave.startDate"
            type="date"
            value={values.sickLeave?.startDate || ""}
            onChange={handleNestedChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Sick Leave End Date"
            name="sickLeave.endDate"
            type="date"
            value={values.sickLeave?.endDate || ""}
            onChange={handleNestedChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}
      {values.type === "Hospital" && (
        <>
          <TextField
            label="Discharge Date"
            name="discharge.date"
            type="date"
            value={values.discharge.date}
            onChange={handleNestedChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Discharge Criteria"
            name="discharge.criteria"
            value={values.discharge.criteria}
            onChange={handleChange}
            fullWidth
          />
        </>
      )}
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default EntryForm;
