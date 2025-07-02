import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

import noImage from '../../assets/noImage.png'
import chatBubble from '../../assets/mensajero.png'
import noComments from '../../assets/mensajeroGris.png'
import clock from '../../assets/clock.png'
//import user from '../../assets/usuario.png'
import wrongImage from '../../assets/wrongImage.png'
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";


const Home = () => {

  // Estado para guardar los posts
  const [posts, setPosts] = useState([])

  // Estado para guardar la cantidad de comentarios por cada post
  const [commentsCount, setCommentsCount] = useState([])

  // Estado para guardar las imagenes de un post
  const [images, setImages] = useState({})

  const { user } = useContext(UserContext);
  console.log("usuario actual:", user);
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

  //El codigo solamente se guarda los posts una unica vez
  //Para que no este haciendo fetch a cada rato
  useEffect(() => {
    getPosts();
  }, [])

// se muestra saludo y boton de crear newPost solo si esta logeado
  return (
    <div>
      <h1>Bienvenida a UnaHur Anti-Social Net</h1>
      <p>Este es el feed principal.</p>

      {user && (
        <>
          <h4 className="text-success mb-2">👋 Hola, {user.nickName}</h4>
          <Link to="/new-post" className="btn btn-primary mb-3">
            Crear nueva publicación
          </Link>
        </>
      )}



      {/* Feed */}
      <div className={styles.feed}>
        {/* Se invierte la lista de posts, para que aparezcan primero los mas recientes */}
        {posts.slice().reverse().map((post) => (
          <Card className={styles.card} key={post.id}>
            <Card.Body>
              {/* Formatea la fecha de publicacion, para que sea mas legible */}
              Fecha publicacion: {new Date(post.createdAt).toLocaleString('es-AR', {hour12: false})}
              <img src={clock} alt="Fecha de Publicacion" style={{ width: '20px', marginLeft: '8px', marginTop: '-4px' }} />
            </Card.Body>

            {/* Carga de imagen, si el url es incorrecto o no tiene imagen, carga otra */}
            <Card.Img
              variant="top"
              className={styles.cardImg}
              src={images[post.id]?.url || noImage}
              onError={img => { img.target.onerror = null; img.target.src = wrongImage; }}
            />
            <Card.Body>
              <Card.Title>
                Usuario: {post.User.nickName}
                <img src={user} alt="Foto de Usuario" style={{ width: '20px', marginLeft: '8px', marginTop: '-3px' }} />
              </Card.Title>
              <Card.Text>
                {post.description}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">

              {/* Agrega los tags al post */}
              <ListGroup.Item>
                Tags: {(post.Tags.length > 0)
                  ? post.Tags.map((tag) => (<span className={styles.tag}>{tag.name}</span>))
                  : 'Ningun tag asociado'}
              </ListGroup.Item>

              {/* Agrega el contador de comentarios */}
              <ListGroup.Item>
                Comentarios: {commentsCount[post.id] ?? 'Cargando...'}

                {/* Si hay comentarios, el icono de comentarios se pone verde, sino gris */}
                <img
                  src={(commentsCount[post.id] == 0)
                    ? noComments
                    : chatBubble
                  }
                  alt="comentarios"
                  style={{ width: '20px', marginLeft: '8px', verticalAlign: 'middle' }}
                />
              </ListGroup.Item>
            </ListGroup>
            <Card.Body>
              <Link to={`/post/${post.id}`} className='btn btn-success' style={{ backgroundColor: "#53ac59" }}>Ver publicacion completa</Link>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
