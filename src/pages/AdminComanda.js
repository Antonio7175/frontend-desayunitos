import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AdminComanda = () => {
  const { codigo } = useParams();
  const [comanda, setComanda] = useState(null);
  const [items, setItems] = useState([]);
  const [horaVisita, setHoraVisita] = useState("");
  const [mensaje, setMensaje] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

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
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/comandas/${comanda.id}/cancelar`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("❌ Comanda cancelada.");
      localStorage.removeItem("codigo_comanda");
      localStorage.removeItem("admin_comanda_email");
      window.location.href = "/";
    } catch (err) {
      alert("Error al cancelar la comanda.");
      console.error(err);
    }
  };

  const handleEliminarItem = async (itemId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este desayuno?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/comandas/item/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error al eliminar el item:", error);
      alert("❌ No se pudo eliminar el desayuno.");
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

          <button className="btn btn-primary mb-4" onClick={enviarComanda}>
            Enviar comanda al bar
          </button>

          <h4>Pedidos de esta comanda</h4>
          <ul className="list-group">
            {items.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>{item.nombreInvitado}</strong>: {item.desayuno.nombre} {item.autorizado ? "✅" : "⏳"}
                </span>

                {comanda.admin.email === user.email && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleEliminarItem(item.id)}
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button className="btn btn-danger mt-4" onClick={cancelarComanda}>
            Cancelar Comanda
          </button>
        </>
      )}
    </div>
  );
};

export default AdminComanda;
