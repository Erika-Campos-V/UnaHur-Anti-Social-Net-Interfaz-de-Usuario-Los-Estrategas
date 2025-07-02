import "../styles/login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [nickName, setName] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate();

  async function validarUsuario(e) {
    e.preventDefault()
    try {  //Trae a todos los users
      const users = await fetch("http://localhost:3001/users");
      if (!users) { //Si es vacío muestra error
        throw new Error("Error al consultar usuarios: " + users.status);
      }
      const usuariosObtenidos = await users.json(); //Convierte a json
      //Busca que haya un user con ese nick para que pueda loguearse
      const usuarioAValidar = usuariosObtenidos.find((u) => u.nickName == nickName); 
      if (!usuarioAValidar) { //Si no lo hay muestra mensaje
        setMensajeError("Nombre de usuario incorrecto.");
      } else if (usuarioAValidar && contraseña != "123456") { //Si hay user pero la contraseña esta mal muestra mensaje
        setMensajeError("Contraseña incorrecta.");
      } else if (usuarioAValidar && contraseña == "123456") {
        //Si está todo bien te redirecciona a la home
        navigate("/");
      }
    } catch (error) {
      throw new Error(
        "Error en la consulta a la base de datos, razon: " + error
      );
    }
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={validarUsuario}>
          <div className="login-field">
            <label className="login-label">Usuario</label>
            <p>{mensajeError}</p>
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
