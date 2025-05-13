import React from "react";
import { Link } from "react-router-dom";

const Home = ({ user }) => {
  return (
    <div className="container text-center">
      {!user ? (
        <>
          <h1>Bienvenido a DesayunosApp</h1>
          <p>Regístrate o inicia sesión para ver nuestros bares y realizar pedidos.</p>
          <Link to="/login" className="btn btn-primary m-2">Iniciar Sesión</Link>
          <Link to="/register" className="btn btn-secondary m-2">Registrarse</Link>
        </>
      ) : user.role === "ADMIN" ? (
        <>
          <h1>Panel de Administración</h1>
          <p>Administra los bares, añade desayunos y gestiona los pedidos.</p>
          <Link to="/bares" className="btn btn-info m-2">Gestionar Bares</Link>
          <Link to="/admin/pedidos" className="btn btn-warning m-2">Gestionar Pedidos</Link>
        </>
      ) : (
        <>
          <h1>Bienvenido {user.email}</h1>
          <p>Consulta la lista de bares y realiza tu pedido.</p>
          <Link to="/bares" className="btn btn-info m-2">Ver Bares</Link>
          <Link to="/pedidos" className="btn btn-success m-2">Hacer un Pedido</Link>
        </>
      )}
    </div>
  );
};

export default Home;
