import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import PostCard from "../components/PostCard"; // Componente reutilizable
import "../styles/profile.css";



export default function Profile() {
  const { user, logout } = useContext(UserContext); 

  const [userPosts, setUserPosts] = useState([]); //Guardar post del user
  
  const [images, setImages] = useState({}); //Imagen principal de cada post
  
  const [commentsCount, setCommentsCount] = useState({}); //Guardar cantidad de comment por post

  
  useEffect(() => { //Obtiene los post del user y asocia img y comment
    const getUserPosts = async () => {
      try { //Obtiene todos los posts
        const res = await fetch("http://localhost:3001/posts");
        const posts = await res.json();
        
        //Filtra solo los del user logueado
        const userOnlyPosts = posts.filter((post) => post.UserId === user.id);
        setUserPosts(userOnlyPosts);

        // Traer la primera imagen asociada a cada post
        const imageMap = {};
        await Promise.all(userOnlyPosts.map(async (post) => {
          const resImg = await fetch(`http://localhost:3001/postimages/post/${post.id}`);
          const imgs = await resImg.json();
          if (imgs.length > 0) {
            imageMap[post.id] = imgs[0];
          }
        }));
        setImages(imageMap);

        // Traer cantidad de comentarios por post
        const counts = {};
        await Promise.all(userOnlyPosts.map(async (post) => {
          const resComment = await fetch(`http://localhost:3001/comments/post/${post.id}`);
          const comments = await resComment.json();
          counts[post.id] = comments.length;
        }));
        setCommentsCount(counts);

      } catch (err) {
        console.error("Error al cargar publicaciones, imágenes o comentarios del usuario:", err);
      }
    };
    //Ejecuta si hay un user logueado
    if (user) getUserPosts();
  }, [user]);

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcazeHuAcZDzv4_61fPLT-S00XnaKXch2YWQ&s"
          alt="Foto de perfil"
          className="profile-pic"
        />
        <div className="profile-info">
          <h2>{user?.nickName}</h2>
          <p>{userPosts.length} publicaciones</p>
          <button className="logOut-Button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="feed responsive-feed">
        {userPosts.map((post) => (
          <div key={post.id} style={{ marginBottom: "20px" }}>
            <PostCard
              
              post={post}
              image={images[post.id]}
              commentsCount={commentsCount[post.id] ?? 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
