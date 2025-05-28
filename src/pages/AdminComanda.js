import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdminComanda = () => {
  const { codigo } = useParams();
  const [comanda, setComanda] = useState(null);
  const [items, setItems] = useState([]);
  const [horaVisita, setHoraVisita] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarComanda = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comandas/${codigo}`);
        const { comanda, items } = response.data;
        setComanda(comanda);
        setItems(items);
      } catch (error) {
        console.error("Error al cargar comanda", error);
        setMensaje("No se pudo cargar la comanda.");
      }
    };

    cargarComanda();
  }, [codigo]);

  const enviarComanda = async () => {
    if (!horaVisita) {
      setMensaje("Debes indicar la hora estimada de visita.");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/comandas/${comanda.id}/enviar`,
        { horaVisita },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMensaje("✅ Comanda enviada al bar.");
    } catch (error) {
      console.error("Error al enviar comanda", error);
      setMensaje("❌ No se pudo enviar la comanda.");
    }
  };

  const cancelarComanda = async () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta comanda?");
    if (!confirmar) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comandas/${comanda.id}/cerrar`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      localStorage.removeItem("codigo_comanda");
      localStorage.removeItem("admin_comanda_email");

      alert("❌ Comanda cancelada.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cancelar comanda", error);
      alert("❌ No se pudo cancelar la comanda.");
    }
  };

  return (
    <div className="container">
      <h2>Gestionar Comanda: {codigo}</h2>
      {mensaje && <p className="alert alert-info">{mensaje}</p>}

      {comanda && (
        <>
          <p><strong>Bar:</strong> {comanda.bar.nombre}</p>
          <p><strong>Estado:</strong> {comanda.estado}</p>

          <div className="mb-3">
            <label>Hora estimada de visita:</label>
            <input
              type="datetime-local"
              className="form-control"
              value={horaVisita}
              onChange={(e) => setHoraVisita(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <button className="btn btn-primary me-3" onClick={enviarComanda}>
              Enviar comanda al bar
            </button>
            <button className="btn btn-danger" onClick={cancelarComanda}>
              Cancelar Comanda
            </button>
          </div>

          <h4>Pedidos de esta comanda</h4>
          <ul className="list-group">
            {items.map((item) => (
              <li key={item.id} className="list-group-item">
                <strong>{item.nombreInvitado}</strong>: {item.desayuno.nombre} {item.autorizado ? "✅" : "⏳"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminComanda;
