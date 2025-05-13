import React, { useEffect, useState } from "react";
import axios from "axios";

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios.get(`${process.env.REACT_APP_API_URL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => setPedidos(response.data))
      .catch(error => console.error("Error al obtener pedidos", error));
  }, [token]);

  const handleAcceptPedido = async (pedidoId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/pedidos/${pedidoId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Pedido aceptado");
      setPedidos(pedidos.filter(p => p.id !== pedidoId)); // Elimina el pedido de la lista tras aceptarlo
    } catch (error) {
      console.error("Error al aceptar pedido", error);
      alert("Error al aceptar pedido");
    }
  };

  return (
    <div className="container">
      <h2>Pedidos Pendientes</h2>
      <ul className="list-group">
        {pedidos.length === 0 ? (
          <p>No hay pedidos pendientes</p>
        ) : (
          pedidos.map(pedido => (
            <li key={pedido.id} className="list-group-item d-flex justify-content-between align-items-center">
              Usuario: {pedido.usuario.email} - Desayuno: {pedido.desayuno.nombre} - Estado: {pedido.estado}
              <button className="btn btn-success" onClick={() => handleAcceptPedido(pedido.id)}>Aceptar</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PedidosAdmin;
