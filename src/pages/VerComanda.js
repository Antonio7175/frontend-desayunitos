import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerComanda = () => {
  const { codigo } = useParams();
  const [comanda, setComanda] = useState(null);
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchComanda = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comandas/${codigo}`);
        if (response.data.comanda && response.data.items) {
          setComanda(response.data.comanda);
          setItems(response.data.items);
        } else if (Array.isArray(response.data)) {
          // fallback por si devuelve lista de items sin DTO
          if (response.data.length > 0) {
            const primera = response.data[0];
            setComanda(primera.comanda);
            setItems(response.data);
          }
        }
      }  catch (error) {
  if (error.response && error.response.status === 403) {
    setMensaje("❌ Esta comanda ha sido cancelada.");
  } else {
    setMensaje("No se pudo cargar la comanda.");
      }
    }
    };

    fetchComanda();
  }, [codigo]);

  return (
    <div className="container">
      <h2>Unirse a la Comanda</h2>

      {mensaje && <p className="alert alert-danger">{mensaje}</p>}

      {comanda ? (
        <>
          <p><strong>Bar:</strong> {comanda.bar?.nombre}</p>
          <p><strong>Estado:</strong> {comanda.estado}</p>

          <h4>Pedidos actuales:</h4>
          <ul className="list-group">
            {items.map((item) => (
              <li key={item.id} className="list-group-item">
                🧍 {item.nombreInvitado} - 🥐 {item.desayuno.nombre}
              </li>
            ))}
          </ul>
          <div className="mt-4">
  <p><strong>Comparte esta comanda con tus amigos:</strong></p>
  <input
    className="form-control"
    readOnly
    value={`${window.location.origin}/unirse-comanda/${codigo}`}
  />
  <button
    className="btn btn-outline-secondary mt-2"
    onClick={() => {
      navigator.clipboard.writeText(`${window.location.origin}/unirse-comanda/${codigo}`);
      alert("🔗 Enlace copiado al portapapeles");
    }}
  >
    Copiar Enlace
  </button>
</div>

        </>
      ) : (
        <p className="text-muted">Cargando datos de la comanda...</p>
      )}
    </div>
  );
};

export default VerComanda;
