import React, { useState, useEffect } from "react";
import axios from "axios";

const Pedidos = () => {
  const [bares, setBares] = useState([]);
  const [barId, setBarId] = useState("");
  const [desayunos, setDesayunos] = useState([]);
  const [desayunoId, setDesayunoId] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const fetchBares = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBares(response.data);
      } catch (error) {
        console.error("❌ Error al obtener bares:", error);
      }
    };

    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarioId(response.data.id);
      } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
      }
    };

    fetchUsuario();
    fetchBares();
  }, []);

  const fetchDesayunos = async (id) => {
    setBarId(id);
    setDesayunoId(""); // Reiniciar selección al cambiar de bar
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares/${id}/menu`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDesayunos(response.data);
    } catch (error) {
      console.error("❌ Error al obtener desayunos:", error);
    }
  };

  const handlePedido = async (e) => {
    e.preventDefault();
    if (!usuarioId) {
      alert("Debes estar autenticado para hacer un pedido.");
      return;
    }
    if (!desayunoId) {
      alert("Debes seleccionar un desayuno.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/pedidos`, { usuarioId, barId, desayunoId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Pedido realizado con éxito");
    } catch (error) {
      console.error("❌ Error en el pedido", error);
      alert("Error al realizar el pedido");
    }
  };

  return (
    <div className="container">
      <h2>Realizar Pedido</h2>
      <form onSubmit={handlePedido}>
        {/* Seleccionar un bar */}
        <select className="form-control mb-2" onChange={(e) => fetchDesayunos(e.target.value)}>
          <option value="">Selecciona un Bar</option>
          {bares.map(bar => (
            <option key={bar.id} value={bar.id}>{bar.nombre}</option>
          ))}
        </select>

        {/* Lista de desayunos con selección */}
        <ul className="list-group">
          {desayunos.map(desayuno => (
            <li 
              key={desayuno.id} 
              className="list-group-item d-flex align-items-center"
              onClick={() => setDesayunoId(desayuno.id)} // 📌 Selecciona el desayuno al hacer clic
              style={{ cursor: "pointer", backgroundColor: desayunoId === desayuno.id ? "#d1ecf1" : "white" }} // Destacar el seleccionado
            >
              <input 
                type="radio" 
                name="desayuno" 
                value={desayuno.id} 
                checked={desayunoId === desayuno.id} 
                onChange={() => setDesayunoId(desayuno.id)} 
                className="me-2"
              />
              {desayuno.imagenUrl && (
                <img 
                  src={`${process.env.REACT_APP_API_URL}${desayuno.imagenUrl}`} 
                  alt={desayuno.nombre} 
                  className="img-thumbnail me-3"
                  style={{ width: "80px", height: "80px" }}
                />
              )}
              <div>
                <strong>{desayuno.nombre}</strong> - {desayuno.precio}€
              </div>
            </li>
          ))}
        </ul>

        <button type="submit" className="btn btn-success mt-3" disabled={!desayunoId}>Pedir</button>
      </form>
    </div>
  );
};

export default Pedidos;
