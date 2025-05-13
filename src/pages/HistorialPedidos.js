import React, { useState, useEffect } from "react";
import axios from "axios";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/pedidos/mis-pedidos", {
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
      await axios.put(`http://localhost:8080/api/pedidos/${pedidoId}/cancelar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado: "Cancelado" } : pedido
        )
      );
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
    }
  };

  return (
    <div className="container">
      <h2>Historial de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="list-group-item">
              <strong>Desayuno:</strong> {pedido.desayuno.nombre} <br />
              <strong>Estado:</strong> {pedido.estado} <br />
              {pedido.estado === "Pendiente" && (
                <button className="btn btn-danger btn-sm mt-2" onClick={() => handleCancelarPedido(pedido.id)}>
                  Cancelar Pedido
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialPedidos;
