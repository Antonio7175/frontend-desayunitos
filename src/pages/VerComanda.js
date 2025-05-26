import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VerComanda = () => {
  const { codigo } = useParams();
  const [comanda, setComanda] = useState(null);
  const [desayunos, setDesayunos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [desayunoId, setDesayunoId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchComanda = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comandas/${codigo}`);
        const data = response.data;
        setComanda(data.comanda);
        setItems(data.items);
        cargarDesayunos(data.comanda.bar.id);
      } catch (error) {
        console.error("Error al cargar comanda", error);
        setMensaje("No se pudo cargar la comanda.");
      }
    };

    const cargarDesayunos = async (barId) => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares/${barId}/menu`);
        setDesayunos(res.data);
      } catch (error) {
        console.error("Error al cargar desayunos del bar", error);
      }
    };

    fetchComanda();
  }, [codigo]);

  const enviarPedido = async () => {
    if (!nombre || !desayunoId) {
      setMensaje("Debes poner tu nombre y elegir un desayuno.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/comandas/${codigo}/agregar-item`, {
        nombreInvitado: nombre,
        desayunoId: desayunoId,
      });

      setMensaje("✅ Pedido agregado correctamente.");
      setNombre("");
      setDesayunoId("");

      // Refrescar la comanda tras agregar un pedido
      const refreshed = await axios.get(`${process.env.REACT_APP_API_URL}/api/comandas/${codigo}`);
      setComanda(refreshed.data.comanda);
      setItems(refreshed.data.items);
    } catch (error) {
      console.error("Error al enviar pedido", error);
      setMensaje("❌ No se pudo agregar tu pedido.");
    }
  };

  return (
    <div className="container">
      <h2>Unirse a la Comanda</h2>

      <p>
        🔗 Enlace de invitación:{" "}
        <a href={`${window.location.origin}/comanda/${codigo}`}>
          {window.location.origin}/comanda/{codigo}
        </a>
      </p>

      {mensaje && <p className="alert alert-info">{mensaje}</p>}

      {comanda && (
        <>
          <p><strong>Bar:</strong> {comanda.bar.nombre}</p>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <select
              className="form-control"
              value={desayunoId}
              onChange={(e) => setDesayunoId(e.target.value)}
            >
              <option value="">-- Elige un desayuno --</option>
              {desayunos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre} - {d.precio}€
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-success mb-4" onClick={enviarPedido}>
            Añadir a la comanda
          </button>

          <h4>Pedidos actuales</h4>
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

export default VerComanda;
