import React, { useEffect, useState } from "react";
import axios from "axios";

const ComandasPendientes = () => {
  const [comandas, setComandas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchComandas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comandas/pendientes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setComandas(response.data);
      } catch (error) {
        console.error("Error al cargar comandas pendientes", error);
      }
    };

    fetchComandas();
  }, []);

  const aceptarComanda = async (id) => {
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/comandas/${id}/aceptar`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setMensaje("✅ Comanda aceptada.");

    // ⏳ Mostrar alerta de impresión con delay de 2 segundos
    alert("🖨️ Imprimiendo la comanda...");
    setTimeout(() => {
      alert("✅ Comanda impresa correctamente.");
    }, 2000);

    // Elimina la comanda de la lista
    setComandas(comandas.filter(c => c.id !== id));
  } catch (error) {
    console.error("Error al aceptar comanda", error);
    setMensaje("❌ No se pudo aceptar la comanda.");
  }
};


  return (
    <div className="container">
      <h2>Comandas Pendientes</h2>
      {mensaje && <p className="alert alert-info">{mensaje}</p>}

      {comandas.length === 0 ? (
        <p>No hay comandas pendientes por aceptar.</p>
      ) : (
        <ul className="list-group">
  {comandas.map((comanda) => (
    <li key={comanda.id} className="list-group-item mb-3">
      <p><strong>Código:</strong> {comanda.codigoUnico}</p>
      <p><strong>Hora estimada:</strong> {comanda.horaVisita?.replace("T", " ") || "No especificada"}</p>
      <p><strong>Creador:</strong> {comanda.admin.email}</p>

      <p><strong>Desayunos pedidos:</strong></p>
      <ul>
        {comanda.items.map((item) => (
          <li key={item.id}>
            {item.nombreInvitado} pidió <strong>{item.desayuno.nombre}</strong> ({item.desayuno.precio}€)
          </li>
        ))}
      </ul>

      <button className="btn btn-success mt-2" onClick={() => aceptarComanda(comanda.id)}>
        Aceptar Comanda
      </button>
    </li>
  ))}
</ul>

      )}
    </div>
  );
};

export default ComandasPendientes;
