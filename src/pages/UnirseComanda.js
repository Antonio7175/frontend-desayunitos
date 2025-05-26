import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UnirseComanda = () => {
  const { codigo } = useParams();
  const [desayunos, setDesayunos] = useState([]);
  const [items, setItems] = useState([]);
  const [nombreInvitado, setNombreInvitado] = useState("");
  const [desayunoId, setDesayunoId] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Cargar items existentes en la comanda
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/comandas/${codigo}`);
        setItems(res.data);
        if (res.data.length > 0) {
          const barId = res.data[0].desayuno.bar.id;
          const menuRes = await axios.get(`http://localhost:8080/api/bares/${barId}/menu`);
          setDesayunos(menuRes.data);
        }
      } catch (error) {
        console.error("❌ Error al cargar la comanda:", error);
        setMensaje("No se pudo cargar la comanda.");
      }
    };
    fetchItems();
  }, [codigo]);

  const agregarItem = async () => {
    try {
      await axios.post(`http://localhost:8080/api/comandas/${codigo}/agregar-item`, {
        desayunoId: Number(desayunoId),
        nombreInvitado,
      });
      setMensaje("✅ Desayuno agregado correctamente.");
      setDesayunoId("");
      setNombreInvitado("");
    } catch (error) {
      console.error("❌ Error al agregar el item:", error);
      setMensaje("Error al agregar tu desayuno.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Unirse a la Comanda: {codigo}</h2>

      <h4 className="mt-4">Desayunos en la comanda:</h4>
      <ul className="list-group">
        {items.map((item) => (
          <li key={item.id} className="list-group-item">
            🧍 {item.nombreInvitado} - 🥐 {item.desayuno.nombre}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <h4>Añadir tu desayuno:</h4>
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Tu nombre"
          value={nombreInvitado}
          onChange={(e) => setNombreInvitado(e.target.value)}
        />
        <select
          className="form-control mt-2"
          value={desayunoId}
          onChange={(e) => setDesayunoId(e.target.value)}
        >
          <option value="">-- Selecciona un desayuno --</option>
          {desayunos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre} - {d.precio}€
            </option>
          ))}
        </select>
        <button
          className="btn btn-success mt-3"
          onClick={agregarItem}
          disabled={!nombreInvitado || !desayunoId}
        >
          Añadir a la comanda
        </button>
        {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
      </div>
    </div>
  );
};

export default UnirseComanda;
