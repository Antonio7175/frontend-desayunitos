import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/usuarios/register", { 
        nombre, 
        email, 
        password,
        rol: "USER" // 🔹 Se asigna el rol "USER" por defecto
      });
      alert("Registro exitoso, ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error("❌ Error en registro", error);
      alert("Error en el registro");
    }
  };

  return (
    <div className="container">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="text" className="form-control mb-2" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-2" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
