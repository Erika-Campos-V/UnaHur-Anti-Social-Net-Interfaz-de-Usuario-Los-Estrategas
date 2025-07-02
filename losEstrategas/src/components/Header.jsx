import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.png"; 
import "../styles/header.css";

const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-custom-green px-3">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src={logo}
          alt="Logo"
          className="logo-navbar"
        />
        UnaHur Anti - Social Net
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">Inicio</Link>
          </li>
          {user && (
            <>
              <li className="nav-item"><Link className="nav-link" to="/profile">Perfil</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/new-post">Nueva Publicación</Link></li>
            </>
          )}
        </ul>

        <ul className="navbar-nav">
          {user ? (
            <>
              <li className="nav-item nav-link text-white">Hola, {user.nickName}</li>
              <li className="nav-item">
                <button style={{marginTop: "4px"}} className="btn btn-outline-light btn-sm" onClick={logout}>Cerrar sesión</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Registro</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
