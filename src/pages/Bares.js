import React, { useEffect, useState } from "react";
import axios from "axios";

const Bares = () => {
  const [bares, setBares] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBares = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBares(response.data);
      } catch (err) {
        console.error("❌ Error al obtener bares:", err);
        setError("Error al cargar los bares.");
      }
    };

    fetchBares();
  }, []);

  return (
    <div className="container">
      <h2>Lista de Bares</h2>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {bares.length > 0 ? (
          bares.map((bar) => (
            <li key={bar.id} className="list-group-item d-flex align-items-center">
              {bar.imagenUrl && (
                <img 
                  src={`${process.env.REACT_APP_API_URL}${bar.imagenUrl}`} 
                  alt={bar.nombre} 
                  className="img-thumbnail me-3"
                  style={{ width: "80px", height: "80px" }}
                />
              )}
              <div>
                <strong>{bar.nombre}</strong> - {bar.direccion}
              </div>
            </li>
          ))
        ) : (
          <p>No hay bares disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default Bares;
