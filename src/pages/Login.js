import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/usuarios/login`, { email, password });

      if (!response.data.token) {
        alert("Error: No se recibió token del backend");
        return;
      }

      localStorage.setItem("token", response.data.token);

      // 🔹 Recuperar el usuario autenticado
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/usuarios/me`, {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      const userData = { email: userResponse.data.email, role: userResponse.data.rol };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate("/"); // Redirigir al Home después del login
    } catch (error) {
      console.error("❌ Error en login", error);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-2" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
