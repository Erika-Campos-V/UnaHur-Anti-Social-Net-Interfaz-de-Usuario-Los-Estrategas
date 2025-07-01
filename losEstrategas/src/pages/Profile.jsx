import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {
  const user = {
    nickName: 'usuarioDemo',
    userId: '123',
    profileImage: "https://i.pravatar.cc/150?img=15",
  };
 const post = [
  { id: 1, descripcion: "Foto 1", image: "https://picsum.photos/300?random=1" },
  { id: 2, descripcion: "Foto 2", image: "https://picsum.photos/300?random=2" },
  { id: 3, descripcion: "Foto 3", image: "https://picsum.photos/300?random=3" },
  { id: 4, descripcion: "Foto 4", image: "https://picsum.photos/300?random=4"},
];
return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <img src={user.profileImage} alt="Foto de perfil" className="profile-pic" />
        <div className="profile-info">
          <h2>{user.nickName}</h2>
          <p>{post.length} publicaciones</p>
          <button
            className="logOut-Button"
            onClick={() => alert("Sesión cerrada")}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="posts-grid">
        {post.map((post) => (
          <div className="post-card" key={post.id}>
            <img src={post.image} alt={post.descripcion} />
            
          </div>
        ))}
      </div>
 </div>
);
}

