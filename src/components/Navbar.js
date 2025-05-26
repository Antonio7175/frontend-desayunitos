import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const codigoComanda = localStorage.getItem("codigo_comanda");
  const adminEmail = localStorage.getItem("admin_comanda_email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("codigo_comanda");
    localStorage.removeItem("admin_comanda_email");
    onLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/DesayunitosLogo.png" alt="Logo" width="40" height="40" className="me-2" />
          DesayunosApp
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {user.role === "USER" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/bares">Bares</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/pedidos">Pedidos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/historial-pedidos">Mis Pedidos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/crear-comanda">Crear Comanda</Link>
                    </li>
                    {codigoComanda && (
                      <li className="nav-item">
                        <Link className="nav-link" to={`/comanda/${codigoComanda}`}>Ver Comanda</Link>
                      </li>
                    )}
                    {codigoComanda && user.email === adminEmail && (
                      <li className="nav-item">
                        <Link className="nav-link text-success fw-bold" to={`/admin/comanda/${codigoComanda}`}>Gestionar Comanda</Link>
                      </li>
                    )}
                    <li className="nav-item">
                      <Link className="nav-link" to="/perfil">Perfil</Link>
                    </li>
                  </>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/pedidos">Admin Pedidos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/desayunos">Admin Desayunos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/bares">Admin Bares</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/comandas-pendientes">Admin Comandas</Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <Link className="nav-link" to="/contacto">Contacto</Link>
                </li>

                <li className="nav-item">
                  <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registro</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contacto">Contacto</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
