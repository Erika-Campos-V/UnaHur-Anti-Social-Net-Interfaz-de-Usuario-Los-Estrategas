import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import PostCard from '../../components/PostCard';
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";


const Home = () => {

  // Estado para guardar los posts
  const [posts, setPosts] = useState([])

  // Estado para guardar la cantidad de comentarios por cada post
  const [commentsCount, setCommentsCount] = useState([])

  // Estado para guardar las imagenes de un post
  const [images, setImages] = useState({})
  //filtrar por tags
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  //paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const { user } = useContext(UserContext);

  async function getPosts() {
    try {
      const data = await fetch('http://localhost:3001/posts')
      if (!data.ok) {
        throw new Error('Error al consultar la base de datos, razon: ' + data.status)
      }
      const postsObtenidos = await data.json()
      setPosts(postsObtenidos)

      // Obtener cantidad de comentarios por post
      const counts = {}
      await Promise.all(postsObtenidos.map(async (post) => {
        const res = await fetch(`http://localhost:3001/comments/post/${post.id}`)
        const comments = await res.json()
        counts[post.id] = comments.length
      }))
      setCommentsCount(counts)

      // Almacenar la primer imagen de cada post
      const firstImage = {}
      await Promise.all(postsObtenidos.map(async (post) => {
        const res = await fetch(`http://localhost:3001/postImages/post/${post.id}`)
        const images = await res.json()
        firstImage[post.id] = images[0]
      }))
      setImages(firstImage)

    } catch (error) {
      throw new Error('Error en la consulta a la base de datos, razon: ' + error)
    }
  }

  useEffect(() => {
    getPosts();
  }, [])

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTagIds]);


  useEffect(() => {
    fetch("http://localhost:3001/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error al cargar tags:", err));
  }, []);

  //  Filtrado por tags seleccionados
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredPosts = selectedTagIds.length > 0
    ? sortedPosts.filter(post =>
      post.Tags.some(tag => selectedTagIds.includes(tag.id))
    )
    : sortedPosts;


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);


  // se muestra saludo y boton de crear newPost solo si esta logeado
  return (
    <div>
      <h1>Bienvenida a UnaHur Anti-Social Net</h1>
      <p>Este es el feed principal.</p>

      {user && (
        <>
          <h4 className="text-success mb-2">Hola, {user.nickName}</h4>
          <Link to="/new-post" className="btn btn-primary mb-3">
            Crear nueva publicación
          </Link>
        </>
      )}

      <h5>Filtrar por etiquetas:</h5>
      <div className="mb-3 d-flex flex-wrap">
        {tags.map(tag => (
          <div key={tag.id} className="form-check me-3">
            <input
              className="form-check-input"
              type="checkbox"
              id={`tag-${tag.id}`}
              checked={selectedTagIds.includes(tag.id)}
              onChange={() =>
                setSelectedTagIds(prev =>
                  prev.includes(tag.id)
                    ? prev.filter(id => id !== tag.id)
                    : [...prev, tag.id]
                )
              }
            />
            <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
              {tag.name}
            </label>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className={styles.feed}>
        {currentPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            image={images[post.id]}
            commentsCount={commentsCount[post.id]}
          />
        ))}
      </div>
      

      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Anterior</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>

    </div>
  );
};

export default Home;
