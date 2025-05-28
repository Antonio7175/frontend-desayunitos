import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrearComanda = () => {
  const [bares, setBares] = useState([]);
  const [barId, setBarId] = useState("");
  const [desayunos, setDesayunos] = useState([]);
  const [desayunoId, setDesayunoId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBares = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBares(response.data);
      } catch (error) {
        console.error("Error al cargar bares", error);
      }
    };

    fetchBares();
  }, []);

  const fetchDesayunos = async (id) => {
    setBarId(id);
    setDesayunoId("");
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares/${id}/menu`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDesayunos(response.data);
    } catch (error) {
      console.error("Error al cargar desayunos", error);
    }
  };

  const crearComanda = async () => {
    if (!barId || !desayunoId) {
      setMensaje("Debes seleccionar un bar y un desayuno.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userEmail = JSON.parse(atob(token.split(".")[1])).sub;

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comandas`,
        {
          barId: barId,
          desayunoId: desayunoId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const codigo = response.data.codigoUnico;
      setCodigo(codigo);
      setMensaje("✅ Comanda creada correctamente.");

      // Guardar en localStorage para navbar
      localStorage.setItem("codigo_comanda", codigo);
      localStorage.setItem("admin_comanda_email", userEmail);
      window.location.reload();

      // Redirigir a la vista de gestión
      navigate(`/admin/comanda/${codigo}`);
      
    } catch (error) {
      console.error("Error al crear comanda", error);
      setMensaje("❌ No se pudo crear la comanda.");
    }
  };

  return (
    <div className="container">
      <h2>Crear Comanda Grupal</h2>

      {mensaje && <p className="alert alert-info">{mensaje}</p>}

      <div className="mb-3">
        <label>Selecciona un bar:</label>
        <select className="form-control" onChange={(e) => fetchDesayunos(e.target.value)}>
          <option value="">-- Elige un bar --</option>
          {bares.map((bar) => (
            <option key={bar.id} value={bar.id}>
              {bar.nombre}
            </option>
          ))}
        </select>
      </div>

      {desayunos.length > 0 && (
        <div className="mb-3">
          <label>Selecciona tu desayuno:</label>
          <select className="form-control" value={desayunoId} onChange={(e) => setDesayunoId(e.target.value)}>
            <option value="">-- Elige un desayuno --</option>
            {desayunos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre} - {d.precio}€
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="btn btn-primary" onClick={crearComanda}>
        Crear Comanda
      </button>
    </div>
  );
};

export default CrearComanda;
