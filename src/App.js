import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Bares from "./pages/Bares";
import Pedidos from "./pages/Pedidos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPedidos from "./pages/AdminPedidos";
import AdminBares from "./pages/AdminBares";
import AdminDesayunos from "./pages/AdminDesayunos";
import Perfil from "./pages/Perfil";
import HistorialPedidos from "./pages/HistorialPedidos";
import Contacto from "./pages/Contacto";
import 'bootstrap/dist/css/bootstrap.min.css'; // ya deberías tener esto
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // <--- ESTO ES CLAVE
import WeatherWidget from "./components/WeatherWidget"; // ⬅️ Widget del clima
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.sub, role: decoded.role });
      } catch (error) {
        console.error("Error decodificando token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/"; // Redirigir al Home al cerrar sesión
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container mt-4">
        <WeatherWidget /> {/* ⬅️ Widget del clima agregado */}
        <Routes>
          {/* Rutas accesibles por cualquier usuario */}
          <Route path="/" element={<Home user={user} />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Rutas de usuarios autenticados */}
          {user && (
            <>
              {user.role === "USER" && (
                <>
                  <Route path="/bares" element={<Bares />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/perfil" element={<Perfil user={user} />} />
                  <Route path="/historial-pedidos" element={<HistorialPedidos />} />
                </>
              )}

              {user.role === "ADMIN" && (
                <>
                  <Route path="/admin/pedidos" element={<AdminPedidos />} />
                  <Route path="/admin/bares" element={<AdminBares />} />
                  <Route path="/admin/desayunos" element={<AdminDesayunos />} />
                </>
              )}
            </>
          )}

          {/* Rutas de autenticación */}
          {!user && (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
            </>
          )}

          {/* Redirección si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
