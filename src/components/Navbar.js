import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  // Leer desde localStorage
  const codigoComanda = localStorage.getItem("codigo_comanda");
  const adminEmail = localStorage.getItem("admin_comanda_email");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  const handleComandaClick = (e, path, isAllowed) => {
    if (!isAllowed) {
      e.preventDefault();
      alert("❗ No hay ninguna comanda activa o no eres el administrador.");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/DesayunitosLogo.png" alt="Logo" width="40" height="40" className="me-2" />
          DesayunosApp
        </Link>

        {/* Botón de hamburguesa (móvil) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {user.role === "USER" && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/bares">Bares</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/pedidos">Pedidos</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/historial-pedidos">Mis Pedidos</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/crear-comanda">Crear Comanda</Link></li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/historial-comandas">Historial Comandas</Link>
                    </li>


                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to={codigoComanda ? `/comanda/${codigoComanda}` : "#"}
                        onClick={(e) => handleComandaClick(e, `/comanda/${codigoComanda}`, !!codigoComanda)}
                        style={{ opacity: codigoComanda ? 1 : 0.5 }}
                      >
                        Ver Comanda
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link text-success fw-bold"
                        to={codigoComanda ? `/admin/comanda/${codigoComanda}` : "#"}
                        onClick={(e) =>
                          handleComandaClick(
                            e,
                            `/admin/comanda/${codigoComanda}`,
                            codigoComanda && user.email === adminEmail
                          )
                        }
                        style={{ opacity: codigoComanda && user.email === adminEmail ? 1 : 0.5 }}
                      >
                        Gestionar Comanda
                      </Link>
                    </li>

                    <li className="nav-item"><Link className="nav-link" to="/perfil">Perfil</Link></li>
                  </>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/admin/pedidos">Admin Pedidos</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/admin/desayunos">Admin Desayunos</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/admin/bares">Admin Bares</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/admin/comandas-pendientes">Admin Comandas</Link></li>
                    <li className="nav-item">
  <Link className="nav-link" to="/admin/historial-comandas">Historial Comandas</Link>
</li>

                  </>
                )}

                <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
                <li className="nav-item">
                  <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Registro</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
