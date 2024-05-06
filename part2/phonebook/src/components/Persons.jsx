import Person from "./Person";
import personService from "../services/persons";

const Persons = ({ results, setPersons, setResults, setMessage }) => {
  const handleDelete = (id) => {
    const person = results.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(id).then((response) => {
        console.log(response);
        personService
          .getAll()
          .then((response) => {
            setPersons(response);
            setResults(response);
            setMessage({
              text: `${person.name} has been deleted`,
              type: "success",
            });
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  };

  return (
    <div>
      {results.map((result) => (
        <div key={result.id}>
          <Person key={result.id} name={result.name} number={result.number} />
          <button onClick={() => handleDelete(result.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
