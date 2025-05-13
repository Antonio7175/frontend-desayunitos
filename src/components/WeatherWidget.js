import React, { useEffect, useState } from "react";
import { fetchWeather } from "../services/weatherService";

const WeatherWidget = ({ location = "Sevilla" }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await fetchWeather(location);
        if (data) {
          setWeather(data);
        } else {
          setError("No se pudo obtener el clima.");
        }
      } catch (err) {
        setError("Error al obtener los datos del clima.");
      }
      setLoading(false);
    };

    loadWeather();
  }, [location]);

  if (loading) return <p>Cargando clima...</p>;
  if (error) return <p>{error}</p>;
  if (!weather) return <p>No hay datos disponibles.</p>;

  return (
    <div className="weather-widget">
      <h4>🌤️ Clima en {location}</h4>
      <p>🌡️ {weather.temp}°C</p>
      <p>💨 Viento: {weather.windspeed} km/h</p>
      <p>💧 Humedad: {weather.humidity}%</p>
      <p>🌍 Condiciones: {weather.conditions}</p>
    </div>
  );
};

export default WeatherWidget;
