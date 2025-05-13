import axios from "axios";

const API_KEY = "6E2WQ5YR2LZY9ZAE2WEJYT4A9"; // ⚠️ Reemplaza con tu clave real
const BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export const fetchWeather = async (location) => {
    try {
        const url = `${BASE_URL}/${encodeURIComponent(location)}?key=${API_KEY}&unitGroup=metric&lang=es&include=current`;

        const response = await axios.get(url);

        console.log("📡 Datos de la API:", response.data); // 🔍 Para depuración

        if (response.data && response.data.currentConditions) {
            return response.data.currentConditions;
        } else {
            console.error("❌ Respuesta inesperada de la API:", response.data);
            return null;
        }
    } catch (error) {
        console.error("❌ Error obteniendo el clima:", error.response?.data || error.message);
        return null;
    }
};
