const FilterPersons = ({ persons, setResults }) => {
  const handleSearchChange = (event) => {
    if (event.target.value === "") {
      setResults(persons);
    } else {
      const search = event.target.value;
      const results = persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(results);
    }
  };

  return (
    <div>
      <h2>Search</h2>
      <div>
        filter shown with <input onChange={handleSearchChange} />
      </div>
    </div>
  );
};

export default FilterPersons;
