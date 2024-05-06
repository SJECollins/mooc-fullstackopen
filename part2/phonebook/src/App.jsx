import { useEffect, useState } from "react";
import AddPersonForm from "./components/AddPersonForm";
import FilterPersons from "./components/FilterPersons";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
      setResults(response);
    });
  }, []);
  const [persons, setPersons] = useState([]);
  const [results, setResults] = useState(persons);
  const [message, setMessage] = useState(null);

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterPersons persons={persons} setResults={setResults} />
      <h3>Add a new</h3>
      <Notification message={message} />
      <AddPersonForm
        persons={persons}
        setPersons={setPersons}
        setResults={setResults}
        setMessage={setMessage}
      />
      <h3>Numbers</h3>
      <Persons
        results={results}
        setPersons={setPersons}
        setResults={setResults}
        setMessage={setMessage}
      />
    </div>
  );
};

export default App;
