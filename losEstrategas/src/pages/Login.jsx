import React from "react";
import "../styles/login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form>
          <div className="login-field">
            <label className="login-label">Usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              className="login-input"
            />
          </div>
  <div className="login-field">
     <label className="login-label">Contraseña</label>
         <input type="password" placeholder="Ingresa tu contraseña" className="login-input" />
         </div>
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
