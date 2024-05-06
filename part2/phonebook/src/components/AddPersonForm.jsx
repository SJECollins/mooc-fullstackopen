import { useState } from "react";
import personService from "../services/persons";
import "../index.css";

const AddPersonForm = ({ persons, setPersons, setResults, setMessage }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.map((person) => person.name).includes(newName)) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        const changedPerson = { ...person, number: newNumber };
        personService
          .update(person.id, changedPerson)
          .then(() => {
            personService.getAll().then((response) => {
              setPersons(response);
              setResults(response);
              setNewName("");
              setNewNumber("");
              setMessage({
                text: `${changedPerson.name}'s number has been updated`,
                type: "success",
              });
              setTimeout(() => {
                setMessage(null);
              }, 5000);
            });
          })
          .catch((error) => {
            console.log(error);
            setMessage({
              text: `Information of ${changedPerson.name} has already been removed from the server`,
              type: "error",
            });
            setTimeout(() => {
              setMessage(null);
            }, 5000);
            setPersons(
              persons.filter((person) => person.id !== changedPerson.id)
            );
            setResults(
              persons.filter((person) => person.id !== changedPerson.id)
            );
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      };
      personService.create(personObject).then((response) => {
        console.log(response);
        setPersons(persons.concat(response));
        setResults(persons.concat(response));
        setNewName("");
        setNewNumber("");
        setMessage({
          text: `${response.name} has been added to the phonebook`,
          type: "success",
        });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input onChange={handleNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default AddPersonForm;
