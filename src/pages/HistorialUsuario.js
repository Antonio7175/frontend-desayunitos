import React, { useEffect, useState } from "react";
import axios from "axios";

const HistorialUsuario = () => {
  const [comandas, setComandas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
  const fetchComandas = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comandas/anteriores/usuario`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // 🔽 Ordenamos por fecha (más reciente primero) y cogemos las 10 primeras
      const ultimasDiez = response.data
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
        .slice(0, 5);

      setComandas(ultimasDiez);
    } catch (error) {
      console.error("Error al cargar comandas del usuario", error);
      setMensaje("No se pudieron cargar las comandas.");
    }
  };

  fetchComandas();
}, []);




  return (
    <div className="container">
      <h2>Mis Comandas</h2>
      {mensaje && <p className="alert alert-danger">{mensaje}</p>}

      {comandas.length === 0 ? (
        <p>No tienes comandas anteriores.</p>
      ) : (
        <ul className="list-group">
          {comandas.map((comanda) => (
  <li key={comanda.id} className="list-group-item mb-3">
    <p><strong>Bar:</strong> {comanda.bar?.nombre}</p>
    <p><strong>Estado:</strong> {comanda.estado}</p>
    <p><strong>Fecha:</strong> {comanda.fechaCreacion?.replace("T", " ")}</p>
    <p><strong>Invitados:</strong></p>
    <ul>
      {comanda.items?.map((item) => (
        <li key={item.id}>
          {item.nombreInvitado} - {item.desayuno?.nombre}
        </li>
      ))}
    </ul>
  </li>
))}

        </ul>
      )}
    </div>
  );
};

export default HistorialUsuario;
