import axios from "axios";
import { useEffect, useState } from "react";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const api_key = import.meta.env.VITE_WEATHER_KEY;
  console.log(api_key);

  useEffect(() => {
    axios
      .get(
        `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${country.capital}&aqi=no`
      )
      .then((response) => {
        setWeather(response.data.current);
      });
  }, [country, api_key]);

  return (
    <>
      <h2>Weather in {country.capital}</h2>
      {weather ? (
        <>
          <p>Temperature: {weather.temp_c}°C</p>
          <img src={weather.condition.icon} alt={weather.condition.text} />
          <p>Wind: {weather.wind_kph} kph</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Weather;
