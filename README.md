# UnaHur Anti-Social Net (Frontend)

Este proyecto es la interfaz web de **UnaHur Anti-Social Net**, una red social académica desarrollada como parte del Trabajo Práctico Integrador de la materia *Construcción de Interfaces de Usuario* (UNAHUR).

El objetivo principal es permitir a estudiantes de la universidad compartir publicaciones, imágenes y comentarios, utilizando un diseño responsivo, funcionalidades modernas y una experiencia accesible para el usuario.

---

## ✨ Funcionalidades

El sistema permite a usuarios:

- Registrarse e iniciar sesión  
- Publicar contenido con imágenes  
- Asociar etiquetas  
- Comentar publicaciones  
- Ver el perfil con publicaciones propias  

---

## 🛠️ Tecnologías utilizadas

- **React + Vite** – Framework SPA y entorno de desarrollo rápido  
- **Bootstrap** – Componentes visuales y diseño responsivo  
- **JavaScript** – Lógica de componentes y estados  
- **React Router DOM** – Navegación entre pantallas  
- **Context API** – Manejo global del usuario autenticado  
- **Fetch API** – Conexión con el backend  

---

## ▶️ ¿Cómo ejecutar el proyecto en local?

Asegurate de tener **Node.js** y **npm** instalados en tu PC.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Erika-Campos-V/UnaHur-Anti-Social-Net-Interfaz-de-Usuario-Los-Estrategas.git
cd UnaHur-Anti-Social-Net-Interfaz-de-Usuario-Los-Estrategas
cd losEstrategas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:  
📍 [http://localhost:5173](http://localhost:5173)

---

## 🌐 API utilizada

Este frontend consume datos de una API REST desarrollada con Node.js y Express.

- **URL base de la API:**  
  [http://localhost:3001](http://localhost:3001)

- **Repositorio del backend:**  
  [https://github.com/lucasfigarola/backend-api](https://github.com/lucasfigarola/backend-api)

---

## ▶️ Cómo ejecutar el backend (API)

### 1. Clonar el repositorio api

```bash
git clone https://github.com/lucasfigarola/backend-api.git
cd backend-api
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Iniciar el servidor

```bash
npm run dev
```

La API estará corriendo en:  
📍 [http://localhost:3001](http://localhost:3001)

⚠️ Asegurate de tener habilitado **CORS** para permitir el acceso desde [http://localhost:5173](http://localhost:5173).


## 📂 Otro metodo de ejecutar el backend, archivo .zip

1. Descargar y descomprimir el archivo `backend-api.zip`.
2. Abrir una terminal dentro de la carpeta `backend-api`.
3. Instalar las dependencias:

```bash
npm install
```

4. Crear y poblar la base de datos con datos de ejemplo:

```bash
node seed.js
```

5. Iniciar el servidor:

```bash
npm start
```

---

## 🔀 Endpoints principales usados

```http
GET    /users                 → Obtener usuarios
POST   /users                 → Registrar un usuario

GET    /posts                 → Listar publicaciones
POST   /posts                 → Crear publicación

GET    /comments/post/:id     → Comentarios de un post

GET    /postImages/post/:id   → Imágenes de un post
POST   /postImages            → Subir imagen de post

GET    /tags                  → Listar etiquetas
```

---

## 📁 Estructura del proyecto

```bash
src/
├── assets/               # Imágenes del sistema
├── components/           # Header, PostCard, Footer.
├── context/              # Contexto de usuario (UserContext, UserProvider)
├── pages/                # Vistas principales (Home, Login, Register, Profile)
├── styles/               # CSS personalizado
├── App.jsx               # Rutas y estructura de navegación
└── main.jsx              # Punto de entrada de la app
```

---

## 👥 Equipo de desarrollo

**Los Estrategas**  
Trabajo grupal - UNAHUR 2025  
Materia: *Construcción de Interfaces de Usuario*
