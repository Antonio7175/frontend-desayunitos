import React, { useState, useEffect } from "react";
import axios from "axios";

const Perfil = ({ user }) => {
  const [usuario, setUsuario] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("/default-user.png"); // Imagen por defecto
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (user?.email) {
      fetchUsuario(); // Recuperar la info del usuario cuando el componente se monta
    }
  }, [user]);

  const fetchUsuario = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuarios/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsuario(response.data);
      if (response.data.logoUrl) {
        setPreview(`${process.env.REACT_APP_API_URL}${response.data.logoUrl}`);
      }
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
    }
  };

  // Configuración de los headers para incluir el token
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const handlePasswordChange = async () => {
    if (!nuevaPassword) {
      setMensaje("La nueva contraseña no puede estar vacía.");
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/usuarios/cambiar-password`,
        { email: usuario?.email, nuevaPassword },
        config
      );

      setMensaje("Contraseña actualizada con éxito.");
      setNuevaPassword("");
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error.response || error);
      setMensaje("Error al actualizar la contraseña.");
    }
  };

  // Manejar selección de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file)); // Vista previa de la imagen seleccionada
  };

  const handleUpload = async () => {
    if (!logo) {
      setMensaje("Por favor selecciona una imagen.");
      return;
    }

    if (!usuario?.id) {
      setMensaje("Error: No se pudo obtener el ID del usuario.");
      return;
    }

    const formData = new FormData();
    formData.append("file", logo);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/usuarios/${usuario.id}/logo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setPreview(`${process.env.REACT_APP_API_URL}${response.data}`);
        setMensaje("¡Imagen actualizada con éxito!");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error.response || error);
      setMensaje("Error al subir la imagen.");
    }
  };

  return (
    <div className="perfil-container">
  <h2>Perfil de Usuario</h2>

  {/* Imagen de usuario */}
  <div className="text-center">
    <img src={preview} alt="Perfil" className="perfil-img" />
  </div>

  {/* Subir nueva imagen */}
  <div className="perfil-upload">
    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control mb-2" />
    <button onClick={handleUpload} className="perfil-btn">Actualizar Logo</button>
  </div>

  <hr />

  {/* Información del usuario */}
  <div className="perfil-info">
    <p><strong>Email:</strong> {usuario?.email}</p>
    <p><strong>Rol:</strong> {usuario?.role}</p>
  </div>

  <h3>Cambiar Contraseña</h3>
  <div className="perfil-password">
    <input
      type="password"
      placeholder="Nueva contraseña"
      className="form-control mb-2"
      value={nuevaPassword}
      onChange={(e) => setNuevaPassword(e.target.value)}
    />
  </div>
  <button className="perfil-btn" onClick={handlePasswordChange}>
    Cambiar Contraseña
  </button>

  {/* Mensaje de éxito o error */}
  {mensaje && <p className="mensaje">{mensaje}</p>}
</div>
  );
};

export default Perfil;
