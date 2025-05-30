import React, { useEffect, useState } from "react";
import axios from "axios";

const Bares = () => {
  const [bares, setBares] = useState([]);
  const [desayunosPorBar, setDesayunosPorBar] = useState({});
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState({});

  const toggleDesayunos = async (barId) => {
    // Si ya están visibles, solo colapsamos
    if (visible[barId]) {
      setVisible((prev) => ({ ...prev, [barId]: false }));
      return;
    }

    // Si ya los tenemos cargados, solo mostramos
    if (desayunosPorBar[barId]) {
      setVisible((prev) => ({ ...prev, [barId]: true }));
      return;
    }

    // Si no están cargados, los pedimos al backend
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares/${barId}/menu`);
      setDesayunosPorBar((prev) => ({ ...prev, [barId]: res.data }));
      setVisible((prev) => ({ ...prev, [barId]: true }));
    } catch (err) {
      console.error("Error al cargar desayunos", err);
      setError("Error al cargar desayunos.");
    }
  };

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
        {bares.map((bar) => (
          <li key={bar.id} className="list-group-item">
            <div
              onClick={() => toggleDesayunos(bar.id)}
              style={{ cursor: "pointer" }}
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center">
                {bar.imagenUrl && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}${bar.imagenUrl}`}
                    alt={bar.nombre}
                    className="img-thumbnail me-3"
                    style={{ width: "80px", height: "80px" }}
                  />
                )}
                <strong>{bar.nombre}</strong> - {bar.direccion}
              </div>
              <span>{visible[bar.id] ? "▲" : "▼"}</span>
            </div>

            {visible[bar.id] && (
              <ul className="mt-2">
                {desayunosPorBar[bar.id]?.map((d) => (
                  <li key={d.id}>
                    🍽️ <strong>{d.nombre}</strong> - {d.descripcion}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bares;
