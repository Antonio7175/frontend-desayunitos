import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBares = () => {
  const [bares, setBares] = useState([]);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBares();
  }, []);

  const fetchBares = async () => {
    try {
   const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bares`, {
  headers: { Authorization: `Bearer ${token}` },
});

      setBares(response.data);
    } catch (error) {
      console.error("Error al obtener bares", error);
      setError("No se pudieron cargar los bares.");
    }
  };

  // 📌 Subir imagen al servidor y devolver la URL
  const handleUploadImage = async (barId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/bares/${barId}/imagen`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );
      return response.data; // Retorna la URL de la imagen
    } catch (error) {
      console.error("Error al subir imagen", error);
      return null;
    }
  };

  // 📌 Agregar bar con imagen opcional
  const handleAddBar = async () => {
    if (!nombre || !direccion) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      // 1️⃣ Primero, creamos el bar sin imagen
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bare`,
        { nombre, direccion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const barId = response.data.id;

      // 2️⃣ Luego, si hay imagen, la subimos
      if (imagen) {
        await handleUploadImage(barId, imagen);
      }

      fetchBares();
      resetForm();
    } catch (error) {
      console.error("Error al agregar bar", error);
      setError("No se pudo agregar el bar.");
    }
  };

  // 📌 Iniciar edición de un bar
  const iniciarEdicion = (bar) => {
    setEditando(bar.id);
    setNombre(bar.nombre);
    setDireccion(bar.direccion);
    setImagen(null);
  };

  // 📌 Editar bar (actualizando la imagen si se cambia)
  const handleEditBar = async () => {
    if (!nombre || !direccion) {
      alert("El nombre y la dirección son obligatorios.");
      return;
    }

    try {
      // 1️⃣ Primero, actualiza los datos del bar (sin imagen)
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/bares/${editando}`,
        { nombre, direccion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Luego, si se seleccionó una nueva imagen, la subimos
      if (imagen) {
        await handleUploadImage(editando, imagen);
      }

      fetchBares();
      resetForm();
      alert("Bar actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar bar", error);
      alert("No se pudo actualizar el bar.");
    }
  };

  // 📌 Eliminar bar
  const handleDeleteBar = async (barId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/bares/${barId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBares();
    } catch (error) {
      console.error("Error al eliminar bar", error);
      setError("No se pudo eliminar el bar.");
    }
  };

  // 📌 Resetear formulario
  const resetForm = () => {
    setEditando(null);
    setNombre("");
    setDireccion("");
    setImagen(null);
    setError(null);
  };

  return (
    <div className="container">
      <h2>Administrar Bares</h2>

      {error && <p className="text-danger">{error}</p>}

      <div>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control mb-2"/>
        <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="form-control mb-2"/>
        <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} className="form-control mb-2"/>

        {editando ? (
          <button onClick={handleEditBar} className="btn btn-warning mb-3">Actualizar Bar</button>
        ) : (
          <button onClick={handleAddBar} className="btn btn-primary mb-3">Agregar Bar</button>
        )}
      </div>

      <ul className="list-group">
        {bares.length === 0 ? (
          <p>No hay bares disponibles.</p>
        ) : (
          bares.map((bar) => (
            <li key={bar.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{bar.nombre}</strong> - {bar.direccion}
                <br />
                {bar.imagenUrl && (
                  <img src={`${process.env.REACT_APP_API_URL}${bar.imagenUrl}`} 
                    alt={bar.nombre} 
                    className="img-thumbnail mt-2"
                    onError={(e) => e.target.src = "/default-image.jpg"}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </div>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => iniciarEdicion(bar)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBar(bar.id)}>Eliminar</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminBares;
