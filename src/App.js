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
import WeatherWidget from "./components/WeatherWidget";
import CrearComanda from "./pages/CrearComanda";
import VerComanda from "./pages/VerComanda";
import AdminComanda from "./pages/AdminComanda";
import ComandasPendientes from "./pages/ComandasPendientes";
import UnirseComanda from "./pages/UnirseComanda";
import HistorialUsuario from "./pages/HistorialUsuario";
import HistorialAdmin from "./pages/HistorialAdmin";



import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codigoComanda, setCodigoComanda] = useState(localStorage.getItem("codigo_comanda"));
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem("admin_comanda_email"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const email = decoded.sub;
        const role = decoded.role;
        setUser({ email, role });

        // Restaurar datos de comanda
        const storedCodigo = localStorage.getItem("codigo_comanda");
        const storedAdminEmail = localStorage.getItem("admin_comanda_email");
        if (storedCodigo) setCodigoComanda(storedCodigo);
        if (storedAdminEmail) setAdminEmail(storedAdminEmail);
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
    localStorage.removeItem("user");
    // ⛔️ No borramos la comanda activa
    setUser(null);
    window.location.href = "/";
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} codigoComanda={codigoComanda} adminEmail={adminEmail} />
      <div className="container mt-4">
        <WeatherWidget />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/comanda/:codigo" element={<VerComanda />} />
          <Route path="/unirse-comanda/:codigo" element={<UnirseComanda />} />

          {!user && (
            <>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
            </>
          )}
          {user && user.role === "USER" && (
            <>
              <Route path="/bares" element={<Bares />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/perfil" element={<Perfil user={user} />} />
              <Route path="/historial-pedidos" element={<HistorialPedidos />} />
              <Route path="/crear-comanda" element={<CrearComanda />} />
              <Route path="/admin/comanda/:codigo" element={<AdminComanda />} />
              <Route path="/historial-comandas" element={<HistorialUsuario />} />
            </>
          )}
          {user && user.role === "ADMIN" && (
            <>
              <Route path="/admin/pedidos" element={<AdminPedidos />} />
              <Route path="/admin/bares" element={<AdminBares />} />
              <Route path="/admin/desayunos" element={<AdminDesayunos />} />
              <Route path="/admin/comandas-pendientes" element={<ComandasPendientes />} />
              <Route path="/admin/historial-comandas" element={<HistorialAdmin />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
