import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import diagnosisService from "../../services/diagnosis";
import { Patient, Entry, Diagnosis } from "../../types";
import { useEffect, useState } from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Transgender, MaleOutlined, FemaleOutlined } from "@mui/icons-material";
import EntryDetails from "./EntryDetails";
import EntryForm from "./EntryForm";

const PatientPage = () => {
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [diagnosisCodes, setDiagnosisCodes] = useState<Diagnosis[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (id) {
        try {
          const patient = await patientService.getOne(id);
          const diagnoses = await diagnosisService.getAll();
          setPatientData(patient);
          setDiagnosisCodes(diagnoses);
        } catch (e) {
          console.error(e);
        }
      }
    };

    void fetchPatientData();
  }, [id]);

  const createEntry = async (values: Entry) => {
    if (id) {
      try {
        const newEntryData: Entry = await patientService.addEntry(id, values);
        console.log("newEntryData", newEntryData);
        setPatientData((prevPatientData) => {
          if (prevPatientData) {
            return {
              ...prevPatientData,
              entries: [...prevPatientData.entries, newEntryData],
            };
          }
          return null;
        });
      } catch (e) {
        console.error("Error adding entry:", e);
      }
    }
  };

  const handleSubmit = (values: Entry) => {
    createEntry(values);
  };

  return (
    <div>
      {id === undefined ? (
        <p>No patient ID provided</p>
      ) : patientData === null ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Box>
            <Typography align="left" variant="h6">
              {patientData.name}
              {patientData.gender === "male" ? (
                <MaleOutlined />
              ) : patientData.gender === "female" ? (
                <FemaleOutlined />
              ) : (
                <Transgender />
              )}
            </Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemText>
                <Typography>
                  date of birth: {patientData.dateOfBirth}
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography>ssn: {patientData.ssn}</Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography>occupation: {patientData.occupation}</Typography>
              </ListItemText>
            </ListItem>
          </List>
          <Box>
            <Typography variant="h6">Add entry</Typography>
            <EntryForm
              onSubmit={handleSubmit}
              diagnosisCodes={diagnosisCodes}
            />
          </Box>
          <Box>
            <Typography variant="h6">Entries</Typography>
            <List>
              {patientData?.entries?.map((entry: Entry) => (
                <ListItem key={entry.id}>
                  <EntryDetails entry={entry} diagnosisCodes={diagnosisCodes} />
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      )}
    </div>
  );
};

export default PatientPage;
