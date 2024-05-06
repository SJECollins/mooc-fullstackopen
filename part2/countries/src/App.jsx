import { useEffect, useState } from "react";
import axios from "axios";
import CountryDetail from "./assets/components/CountryDetail";
import Weather from "./assets/components/Weather";

function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [showDetails, setShowDetails] = useState(null);

  const handleFilterChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setFilter(inputValue);
  };

  const handleShowDetails = (country) => {
    if (showDetails === country) {
      setShowDetails(null);
    } else {
      setShowDetails(country);
    }
  };

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const filtered = response.data.filter((country) =>
          country.name.common.toLowerCase().includes(filter.toLowerCase())
        );
        setCountries(filtered);
      });
  }, [filter]);

  return (
    <div>
      <div>
        find countries <input onChange={handleFilterChange} />
      </div>
      <div>
        {countries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : countries.length > 1 ? (
          countries.map((country) => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShowDetails(country)}>show</button>
              {showDetails == country && <CountryDetail country={country} />}
            </div>
          ))
        ) : countries.length === 1 ? (
          countries.map((country) => (
            <div key={country.name.common}>
              <h1>{country.name.common}</h1>
              <CountryDetail country={country} />
              <Weather country={country} />
            </div>
          ))
        ) : (
          <p>No matches</p>
        )}
      </div>
    </div>
  );
}

export default App;
