import "../styles/login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nickName, setName] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [email, setEmail] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const navigate = useNavigate();

  async function validarUsuario(e) {
    e.preventDefault();
    
    setErrorEmail("");
    setMensajeError("")

    try { //Trae todos los usuarios registrados
      const users = await fetch("http://localhost:3001/users");
      if (!users) {
        throw new Error("Error al consultar usuarios: " + users.status);
      }
      const usuariosObtenidos = await users.json();

      if (!nickName.trim()) {  //Si esta vacio muestra mensaje
        setMensajeError("El nombre no es valido.");
        return
      } else if (!/\S+@\S+\.\S+/.test(email)) { //Si no es formato email muestra mensaje
        setErrorEmail("Email debe ser correcto.");
        return
      } else if (usuariosObtenidos.find((u) => u.nickName == nickName)) { //Si ya hay un user con ese nick muestra mensaje
        setMensajeError("El nombre de usuario no está disponible.");
        return
      } else if (usuariosObtenidos.find((u) => u.email == email)) { //Si hay un user con ese email muestra mensaje.
        setErrorEmail("El email no está disponible.");
        return
      } else if (contraseña != "123456") { //Si la contraseña es incorrecta muestra mensaje
        setMensajeError("Contraseña incorrecta.");
        return
      } else if (contraseña == "123456") { // Si todo esta bien registra al usuario
        const user = await fetch("http://localhost:3001/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nickName: nickName,
            email: email,
          }),
        });
        if(user.ok){ //Si se registró correctamente te redirecciona al login
          navigate("/login");
        }
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
          <h2 className="login-title">Registrarse</h2>
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
              <label className="login-label">Email</label>
              <p>{errorEmail}</p>
              <input
                type="text"
                placeholder="Ingresa tu email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              Registrarme
            </button>
          </form>
        </div>
      </div>
    );
  
};
export default Register;
