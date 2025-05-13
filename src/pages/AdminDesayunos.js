import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDesayunos = () => {
  const [desayunos, setDesayunos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [bares, setBares] = useState([]);
  const [barId, setBarId] = useState("");
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDesayunos();
    fetchBares();
  }, []);

  const fetchDesayunos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/desayunos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDesayunos(response.data);
    } catch (error) {
      console.error("Error al obtener desayunos", error);
      setError("No se pudieron cargar los desayunos.");
    }
  };

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
  const handleUploadImage = async (desayunoId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/desayunos/${desayunoId}/imagen`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );
      return response.data; // Retorna la URL de la imagen
    } catch (error) {
      console.error("Error al subir imagen", error);
      return null;
    }
  };

  // 📌 Agregar desayuno (primero se crea, luego se sube la imagen)
  const handleAddDesayuno = async () => {
    if (!nombre || !precio || !barId) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      // 1️⃣ Primero, crea el desayuno sin imagen
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/desayunos/${barId}`,
        { nombre, descripcion, precio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const desayunoId = response.data.id;

      // 2️⃣ Luego, si hay imagen, la subimos
      let imagenUrl = null;
      if (imagen) {
        imagenUrl = await handleUploadImage(desayunoId, imagen);
      }

      // 3️⃣ Finalmente, actualizamos el desayuno con la imagen (si es necesario)
      if (imagenUrl) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/desayunos/${desayunoId}`,
          { imagenUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchDesayunos();
      resetForm();
    } catch (error) {
      console.error("Error al agregar desayuno", error);
      setError("No se pudo agregar el desayuno.");
    }
  };

  // 📌 Iniciar edición de un desayuno
  const iniciarEdicion = (desayuno) => {
    setEditando(desayuno.id);
    setNombre(desayuno.nombre);
    setDescripcion(desayuno.descripcion || "");
    setPrecio(desayuno.precio);
    setBarId(desayuno.bar?.id || "");
    setImagen(null);
  };

  // 📌 Editar desayuno (actualizando la imagen si se cambia)
  const handleEditDesayuno = async () => {
    if (!nombre || !precio) {
      alert("El nombre y el precio son obligatorios.");
      return;
    }

    try {
      let imagenUrl = null;

      // 1️⃣ Si se selecciona una nueva imagen, la subimos primero
      if (imagen) {
        imagenUrl = await handleUploadImage(editando, imagen);
      }

      // 2️⃣ Luego, actualizamos el desayuno con la imagen (si hay una nueva)
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/desayunos/${editando}`,
        { nombre, descripcion, precio, imagenUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchDesayunos();
      resetForm();
      alert("Desayuno actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar desayuno", error);
      alert("No se pudo actualizar el desayuno.");
    }
  };

  // 📌 Eliminar desayuno
  const handleDeleteDesayuno = async (desayunoId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/desayunos/${desayunoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDesayunos();
    } catch (error) {
      console.error("Error al eliminar desayuno", error);
      setError("No se pudo eliminar el desayuno.");
    }
  };

  // 📌 Resetear formulario
  const resetForm = () => {
    setEditando(null);
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setBarId("");
    setImagen(null);
    setError(null);
  };

  return (
    <div className="container">
      <h2>Administrar Desayunos</h2>

      {error && <p className="text-danger">{error}</p>}

      <div>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control mb-2"/>
        <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="form-control mb-2"/>
        <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} className="form-control mb-2"/>
        <select className="form-control mb-2" value={barId} onChange={(e) => setBarId(e.target.value)}>
          <option value="">Selecciona un bar</option>
          {bares.map((bar) => (
            <option key={bar.id} value={bar.id}>{bar.nombre}</option>
          ))}
        </select>

        <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} className="form-control mb-2"/>

        {editando ? (
          <button onClick={handleEditDesayuno} className="btn btn-warning mb-3">Actualizar Desayuno</button>
        ) : (
          <button onClick={handleAddDesayuno} className="btn btn-primary mb-3">Agregar Desayuno</button>
        )}
      </div>

      <ul className="list-group">
        {desayunos.length === 0 ? (
          <p>No hay desayunos disponibles.</p>
        ) : (
          desayunos.map((desayuno) => (
            <li key={desayuno.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{desayuno.nombre}</strong> - {desayuno.precio}€
                <br />
                {desayuno.descripcion && <p>{desayuno.descripcion}</p>}
                {desayuno.imagenUrl && (
                  <img src={`${process.env.REACT_APP_API_URL}${desayuno.imagenUrl}`} 
                    alt={desayuno.nombre} 
                    className="img-thumbnail mt-2"
                    onError={(e) => e.target.src = "/default-image.jpg"}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </div>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => iniciarEdicion(desayuno)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDesayuno(desayuno.id)}>Eliminar</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminDesayunos;
