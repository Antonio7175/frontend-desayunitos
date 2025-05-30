import React, { useEffect, useState } from "react";
import axios from "axios";

const Bares = () => {
  const [bares, setBares] = useState([]);
  const [menus, setMenus] = useState({});
  const [barExpandido, setBarExpandido] = useState(null);
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

  const toggleMenu = async (barId) => {
    if (barExpandido === barId) {
      setBarExpandido(null);
      return;
    }

    if (!menus[barId]) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bares/${barId}/menu`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMenus(prev => ({ ...prev, [barId]: response.data }));
      } catch (error) {
        console.error("❌ Error al obtener el menú:", error);
      }
    }

    setBarExpandido(barId);
  };

  return (
    <div className="container">
      <h2>Lista de Bares</h2>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {bares.length > 0 ? (
          bares.map((bar) => (
            <li key={bar.id} className="list-group-item">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
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
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={() => toggleMenu(bar.id)}>
                  {barExpandido === bar.id ? "Ocultar menú" : "Ver menú"}
                </button>
              </div>

              {barExpandido === bar.id && menus[bar.id] && (
                <ul className="list-group mt-2">
                  {menus[bar.id].map((desayuno) => (
                    <li key={desayuno.id} className="list-group-item">
                      🥐 <strong>{desayuno.nombre}</strong> - {desayuno.precio} €
                    </li>
                  ))}
                </ul>
              )}
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
