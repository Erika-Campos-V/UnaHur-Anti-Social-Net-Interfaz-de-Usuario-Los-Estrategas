import "../styles/login.css";
import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(UserContext); //  función del contexto
  const [nickName, setName] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate();

  async function validarUsuario(e) {
    e.preventDefault();
    setMensajeError("");

    const resultado = await login(nickName, contraseña); // usás login del contexto
    if (resultado.success) {
      navigate("/"); // redirige si fue exitoso
    } else {
      setMensajeError(resultado.message); //  muestra error si algo falló
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={validarUsuario}>
          <div className="login-field">
            <label className="login-label">Usuario</label>
            <p className="text-danger">{mensajeError}</p>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              className="login-input"
              value={nickName}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label className="login-label">Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="login-input"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
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
