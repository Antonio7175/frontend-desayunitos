import React, { useEffect, useState } from "react";
import axios from "axios";

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPedidos(response.data))
      .catch((error) => console.error("Error al obtener pedidos", error));
  }, [token]);

  const handleAcceptPedido = async (pedidoId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pedidos/${pedidoId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensaje("✅ Pedido aceptado");
      setPedidos(pedidos.filter((p) => p.id !== pedidoId));
    } catch (error) {
      console.error("Error al aceptar pedido", error);
      setMensaje("❌ Error al aceptar pedido");
    }
  };

  const handleRejectPedido = async (pedidoId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/pedidos/${pedidoId}/rechazar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensaje("❌ Pedido rechazado");
      setPedidos(pedidos.filter((p) => p.id !== pedidoId));
    } catch (error) {
      console.error("Error al rechazar pedido", error);
      setMensaje("❌ Error al rechazar pedido");
    }
  };

  return (
    <div className="container">
      <h2>Pedidos Pendientes</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <ul className="list-group">
        {pedidos.length === 0 ? (
          <p>No hay pedidos pendientes</p>
        ) : (
          pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                Usuario: <strong>{pedido.usuario.email}</strong> — Desayuno:{" "}
                <strong>{pedido.desayuno.nombre}</strong> — Estado:{" "}
                {pedido.estado}
              </div>
              <div>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleAcceptPedido(pedido.id)}
                >
                  Aceptar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRejectPedido(pedido.id)}
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PedidosAdmin;
