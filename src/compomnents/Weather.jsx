import React, { useEffect, useRef, useState } from "react";
import "../compomnents/Weather.css";
import search_icon from "../assets/search.png";
import humidity_icon from "../assets/humidity.png.png";
import wind_icon from "../assets/wind.png.png";
import clear_icon from "../assets/clear.png.png";
import cloud_icon from "../assets/cloud.png.png";
import rain_icon from "../assets/rain.png.png";
import snow_icon from "../assets/snow.png.png";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef();

  const weatherIcons = {
    0: clear_icon,  
    1: clear_icon,
    2: cloud_icon,
    3: cloud_icon,
    45: cloud_icon,
    48: cloud_icon,
    51: rain_icon,
    61: rain_icon,
    71: snow_icon,
  };

  const search = async (city) => {
    if(city.length === 0){
      toast.error("Please Enter City Name")
      return
    }
    if (!city) {
      toast.error("Enter a city name!");
      return;
    }

    try { 
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        toast.warn("City not found!");
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];
 
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
      const weatherResponse = await fetch(weatherUrl);
      const weather = await weatherResponse.json();

      const current = weather.current;
      const icon = weatherIcons[current.weather_code] || clear_icon;

      setWeatherData({
        city: name,
        temperature: Math.floor(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        icon: icon,
      });
    } catch (err) {
      console.error("Error fetching weather:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className="weather">
      <ToastContainer position="top-right"/>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Enter city..."
        onKeyDown={(e)=>{
          if(e.key === "Enter"){
            search(inputRef.current.value)
          }
        }} />
        <img
          src={search_icon}
          alt="search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="weather" className="weather-icon" />
          <p className="temp">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.city}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p className="additional">{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p className="additional">{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
