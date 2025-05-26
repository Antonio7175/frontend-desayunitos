import React, { useState, useEffect } from "react";
import axios from "axios";

const CrearComanda = () => {
  const [bares, setBares] = useState([]);
  const [desayunos, setDesayunos] = useState([]);
  const [barId, setBarId] = useState("");
  const [desayunoId, setDesayunoId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  // Cargar bares al iniciar
  useEffect(() => {
    const fetchBares = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/bares", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBares(res.data);
      } catch (error) {
        console.error("Error al cargar bares", error);
      }
    };
    fetchBares();
  }, [token]);

  // Cargar desayunos al cambiar bar
  useEffect(() => {
    const fetchDesayunos = async () => {
      if (!barId) return;
      try {
        const res = await axios.get(`http://localhost:8080/api/bares/${barId}/menu`);
        setDesayunos(res.data);
      } catch (error) {
        console.error("Error al cargar desayunos", error);
      }
    };
    fetchDesayunos();
  }, [barId]);

  const crearComanda = async () => {
    try {
      const userEmail = JSON.parse(atob(token.split(".")[1])).sub;

      const res = await axios.post(
        "http://localhost:8080/api/comandas",
        { barId: Number(barId), desayunoId: Number(desayunoId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const codigoGenerado = res.data.codigoUnico;
      localStorage.setItem("codigo_comanda", codigoGenerado);
      localStorage.setItem("admin_comanda_email", userEmail);

      setCodigo(codigoGenerado);
      setMensaje(`✅ Comanda creada. Código: ${codigoGenerado}`);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al crear la comanda.");
    }
  };

  return (
    <div className="text-center">
      <h2>Crear nueva Comanda</h2>

      <div className="form-group mt-3">
        <label>Selecciona un Bar:</label>
        <select
          className="form-control"
          value={barId}
          onChange={(e) => setBarId(e.target.value)}
        >
          <option value="">-- Selecciona un bar --</option>
          {bares.map((bar) => (
            <option key={bar.id} value={bar.id}>
              {bar.nombre}
            </option>
          ))}
        </select>

        <label className="mt-3">Selecciona un Desayuno:</label>
        <select
          className="form-control"
          value={desayunoId}
          onChange={(e) => setDesayunoId(e.target.value)}
          disabled={!barId}
        >
          <option value="">-- Selecciona un desayuno --</option>
          {desayunos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre} - {d.precio}€
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={crearComanda}
        disabled={!barId || !desayunoId}
      >
        Crear Comanda
      </button>

      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}

      {codigo && (
        <div className="mt-3">
          <p>🔗 Comparte este enlace con tus amigos:</p>
          <a href={`/unirse-comanda/${codigo}`}>
            http://localhost:3000/unirse-comanda/{codigo}
          </a>
        </div>
      )}
    </div>
  );
};

export default CrearComanda;
