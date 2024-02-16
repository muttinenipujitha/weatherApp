import React, { useState } from 'react';

const api = {
  key: "9ea1d0ed56470f9e7d9f8fe7db4561dd",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [recentSearches, setRecentSearches] = useState([]);
  const [unit, setUnit] = useState('metric'); // Default unit is Celsius
  const [error, setError] = useState('');
  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('City not found');
          }
          return res.json();
        })
        .then(result => {
          console.log(result);
          setWeather(result);
          setQuery('');
          updateRecentSearches(result.name);
          setError('');
        })
        .catch(error => {
          console.error('Error fetching weather data:', error.message);
          setWeather({});
          setQuery('');
          setError('City not found');
        });
    }
  };
  

  const updateRecentSearches = (searchedCity) => {
    setRecentSearches(prevSearches => {
      const updatedSearches = [searchedCity, ...prevSearches.slice(0, 4)];
      return updatedSearches.filter((search, index) => updatedSearches.indexOf(search) === index);
    });
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const temperatureUnit = unit === 'metric' ? '°C' : '°F';
  const temperatureValue = unit === 'metric' ? Math.round(weather.main?.temp) : Math.round((weather.main?.temp * 9/5) + 32);

  const windSpeedUnit = unit === 'metric' ? 'm/s' : 'mph';
  const windSpeedValue = unit === 'metric' ? Math.round(weather.wind?.speed) : Math.round(weather.wind?.speed * 2.237);

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  };

  return (
    <div className={(typeof weather.main !== "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main !== "undefined") && (
          <div>
            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {temperatureValue}{temperatureUnit}
                <button onClick={toggleUnit} className="unit-toggle">{unit === 'metric' ? '°F' : '°C'}</button>
              </div>
              <div className="weather">{weather.weather[0].main}</div>
              <div className='weather'>Latitude: {weather.coord.lat}</div>
              <div className='weather'>Longitude: {weather.coord.lon}</div>
              <div className='weather'>Wind Speed: {windSpeedValue} {windSpeedUnit}</div>
            </div>
          </div>
        )}
        <div className="recent-searches" style={{textAlign:'center',position:'relative',bottom:'500px',left:"300px"}}>
          <h3 style={{ color: 'white' }}>Recent Searches:</h3>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index} style={{color:'white',listStyle:'None'}}>{search}</li>
            ))}
          </ul>
        </div>
        {error && <p className="error" style={{color:'white'}}>{error}</p>}
      </main>
    </div>
  );
}

export default App;




