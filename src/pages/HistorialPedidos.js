import React, { useState, useEffect } from "react";
import axios from "axios";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pedidos/mis-pedidos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(response.data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    fetchPedidos();
  }, [token]);

  const handleCancelarPedido = async (pedidoId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/pedidos/${pedidoId}/cancelar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId
            ? { ...pedido, estado: "CANCELADO", canceladoPorAdmin: false }
            : pedido
        )
      );
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
    }
  };

  const handleBorrarHistorial = async () => {
  if (!window.confirm("¿Estás seguro de que quieres borrar tu historial de pedidos?")) return;

  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/pedidos/eliminar-todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPedidos([]); // Limpiar del estado también
  } catch (error) {
    console.error("Error al eliminar historial:", error);
  }
};


  const traducirEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "⏳ Pendiente";
      case "ACEPTADO":
        return "✅ Aceptado";
      case "CANCELADO":
        return "❌ Cancelado";
      case "PAGADO":
        return "💰 Pagado";
      default:
        return estado;
    }
  };

  return (
    <div className="container">
      <h2>Historial de Pedidos</h2>
      <button className="btn btn-warning mb-3" onClick={handleBorrarHistorial}>
  Borrar historial de pedidos cancelados o aceptados
</button>

      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="list-group-item">
              <strong>Desayuno:</strong> {pedido.desayuno.nombre} <br />
              <strong>Estado:</strong>{" "}
              <span
                className={
                  pedido.estado === "CANCELADO"
                    ? "text-danger"
                    : pedido.estado === "ACEPTADO"
                    ? "text-success"
                    : ""
                }
              >
                {traducirEstado(pedido.estado)}
              </span>
              <br />

              {pedido.estado === "PENDIENTE" && (
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => handleCancelarPedido(pedido.id)}
                >
                  Cancelar Pedido
                </button>
              )}

              {pedido.estado === "CANCELADO" && (
                <div className="text-danger mt-2">
                  Este pedido fue cancelado por{" "}
                  {pedido.canceladoPorAdmin ? "el bar" : "ti"}.
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialPedidos;
