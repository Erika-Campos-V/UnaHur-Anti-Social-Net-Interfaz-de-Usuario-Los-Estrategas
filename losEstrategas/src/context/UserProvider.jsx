import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (nickName, password) => {
    if (password !== "123456") {
      return { success: false, message: "Contraseña incorrecta" };
    }

    try {
      const res = await fetch("http://localhost:3001/users");
      const users = await res.json();

      const foundUser = users.find((u) => u.nickName === nickName);
      if (!foundUser) {
        return { success: false, message: "Usuario no encontrado" };
      }

      setUser(foundUser);
      return { success: true };
    } catch (err) {
      console.error("Error al conectar con la API", err);
      return { success: false, message: "Error al conectar con la API" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
