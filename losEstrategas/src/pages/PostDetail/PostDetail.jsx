import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import styles from "./PostDetail.module.css"

//Imagenes e iconos para los post
import noImage from "../../assets/noImage.png"
import wrongImage from "../../assets/wrongImage.png"
import clock from "../../assets/clock.png"
import usuario from "../../assets/usuario.png"
import tag from "../../assets/tag.png"

//Me importo lo necesario para utilizar el user que se logueo
//useContext se importo mas arriba.
import { UserContext } from '../../context/UserContext';

const PostDetail = () => {

  const { id } = useParams()

  //Para guardar el usuario logueado
  const { user } = useContext(UserContext)

  //Para guardar el post - CREO QUE NO SE USA
  const [post, setPost] = useState(null)

  //Para guardar las imagenes del post
  const [images, setImages] = useState([])

  const [comentarios, setComentarios] = useState([])

  const getPostById = useCallback(async () => {
    try {

      const data = await fetch(`http://localhost:3001/posts/${id}`)
      if (!data.ok) {
        throw new Error('Error al consultar la base de datos, razon: ' + data.status)
      }
      const postObtenido = await data.json()
      setPost(postObtenido)

      //Guardar las imagenes del post
      const imagesRes = await fetch(`http://localhost:3001/postImages/post/${postObtenido.id}`)
      const images = await imagesRes.json()
      setImages(images)


      //Guardar los comentarios del post
      const commentRes = await fetch(`http://localhost:3001/comments/post/${postObtenido.id}`)
      const comments = await commentRes.json()
      setComentarios(comments)

    } catch (error) {
      throw new Error('Error en la consulta a la base de datos, razon: ' + error)
    }
  }, [id])

  async function agregarComentario(e) {
    //Previene que la pagina se recargue
    e.preventDefault();
    //Se guarda lo que se escribio en el 'textArea' del form
    const comentarioNuevo = e.target.elements["Nuevo comentario"].value;

    //Si el comentario estaba vacio, no hace nada
    if (!comentarioNuevo.trim()) return

    try {
      const res = await fetch('http://localhost:3001/comments', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comentarioNuevo,
          userId: user.id,
          postId: post.id
        })
      });

      if (!res.ok) {
        throw new Error("Error al publicar el comentario");
      }


      //Me traigo devuelta todos los comentarios del post, incluido el nuevo
      //Y lo coloco en el estado de los comentarios
      const todosLosComment = await fetch(`http://localhost:3001/comments/post/${post.id}`)
      const todosCommentNuevo = await todosLosComment.json()
      setComentarios(todosCommentNuevo)

      //Limpia lo que se puso en el form
      e.target.reset();

    } catch (error) {
      throw new Error('Error en la consulta a la base de datos, razon: ' + error)
    }
  }

  //El codigo solamente se guarda el posts una unica vez
  //Para que no este haciendo fetch a cada rato
  useEffect(() => {
    getPostById();
  }, [getPostById])

  //Le da tiempo a que se guarde un post para mostrar los datos
  if (!post) {
    return <p>Pagina cargando...</p>
  }

  //Aca comienza el RETURN
  //Si el post contiene imagen, se muestra en un formato con imagenes, y al costado la demas informacion
  //Si el post no tiene imagenes, no se muestra el carrousel de imagenes
  if (images.length > 0) {
    return (
      <div className={styles.grid}>

        {/* Carrousel de imagenes */}
        <div>
          <Carousel>
            {images.map((imagen) => (
              <Carousel.Item>
                <img src={imagen.url || noImage} alt="Imagen" className="d-block mx-auto"
                  onError={img => { img.target.onerror = null; img.target.src = wrongImage; }}
                  style={{ height: 400, objectFit: 'contain' }} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Informacion del post, fecha, usuario, desc, comentarios */}
        <div className={styles.post}>

          {/* Informacion de fecha */}
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '5px', borderBottom: '2px dashed #53ac59' }}>
            <img src={clock} alt="reloj" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }} />
            <p style={{ marginBottom: '0px', fontSize: '25px' }}>Fecha publicacion: {new Date(post.createdAt).toLocaleString('es-AR', { hour12: false })}</p>
          </div>

          {/* Tags del post */}
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: "10px", paddingTop: '10px', borderBottom: '2px dashed #53ac59' }}>
            <img src={tag} alt="tag" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }} />
            {(post.Tags.length === 0)
              ? 'Ningun tag asociado'
              : post.Tags.map((tag) => (<span className={styles.tag}>{tag.name}</span>))
            }
          </div>

          {/* Usuario */}
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '5px', borderBottom: '2px dashed #53ac59' }}>
            <img src={usuario} alt="icono de usuario" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }} />
            <p style={{ marginBottom: '0px', fontSize: '25px' }}>Usuario: {post.User.nickName}</p>
          </div>

          {/* Descripcion */}
          <p style={{ fontWeight: 'bolder', fontSize: '30px', paddingLeft: '10px', borderBottom: '3px solid #53ac59', paddingBottom: '20px' }}>
            {post.description}
          </p>

          {/* Comentarios */}
          <div style={{ padding: '0px 20px' }}>
            {comentarios.length === 0
              // Si no hay comentarios, pone un mensaje por defecto
              ? <p>No hay comentarios, aporta a la anti-discusion...</p>
              // Si los hay, coloca los comentarios con el map
              : comentarios.map((comment, idx) => (
                <div>
                  {/* Burbuja de dialogo y content */}
                  <div key={idx} className={styles.comentarioBubble}>
                    {comment.content}
                  </div>
                  {/* Icono de usuario, nickName y fecha */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={usuario} alt="icono de usuario" style={{ width: '20px', height: '20px', marginLeft: '3px', marginRight: '5px' }} />
                    <p style={{ marginBottom: '0px', fontSize: '20px' }}>{comment.User.nickName} - {new Date(comment.createdAt).toLocaleString('es-AR')}</p>
                  </div>
                </div>
              ))
            }

            {/* Seccion para agregar un nuevo comentario */}
            {user ? (
              <form onSubmit={agregarComentario} style={{ marginTop: "30px", marginBottom: "20px" }}>
                <textarea className={styles.form} name="Nuevo comentario" placeholder='Esto es lo que opino de tu post: ...' />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type='submit' className='btn btn-success' style={{ backgroundColor: "#53ac59" }}>Publicar comentario</button>
                </div>
              </form>
            ) : (
              <p style={{ color: "#53ac59", fontWeight: "bold", marginLeft: "20px", marginTop: "30px" }}>
                Iniciá sesión para comentar.
              </p>
            )}
          </div>


        </div>
      </div>
    )

  } else {

    // Si el post no tiene imagenes, no muestra la seccion
    return (
      <div className={styles.postSinImagen}>

        {/* Informacion de fecha */}
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '5px', borderBottom: '2px dashed #53ac59' }}>
          <img src={clock} alt="reloj" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }} />
          <p style={{ marginBottom: '0px', fontSize: '25px' }}>Fecha publicacion: {new Date(post.createdAt).toLocaleString('es-AR', { hour12: false })}</p>
        </div>

        {/* Tags del post */}
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: "10px", paddingTop: '10px', borderBottom: '2px dashed #53ac59' }}>
          <img src={tag} alt="tag" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }} />
          {(post.Tags.length === 0)
            ? 'Ningun tag asociado'
            : post.Tags.map((tag) => (<span className={styles.tag}>{tag.name}</span>))
          }
        </div>

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '5px', borderBottom: '2px dashed #53ac59' }}>
          <img src={usuario} alt="icono de usuario" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }} />
          <p style={{ marginBottom: '0px', fontSize: '25px' }}>Usuario: {post.User.nickName}</p>
        </div>

        {/* Descripcion */}
        <p style={{ fontWeight: 'bolder', fontSize: '30px', paddingLeft: '10px', borderBottom: '3px solid #53ac59', paddingBottom: '20px' }}>
          {post.description}
        </p>

        {/* Comentarios */}
        <div style={{ padding: '0px 20px' }}>
          {comentarios.length === 0
            ? <p>No hay comentarios, aporta a la anti-discusion...</p>
            : comentarios.map((comment, idx) => (
              <div>
                {/* Burbuja de dialogo y content */}
                <div key={idx} className={styles.comentarioBubble}>
                  {comment.content}
                </div>
                {/* Icono de usuario, nickName y fecha */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={usuario} alt="icono de usuario" style={{ width: '20px', height: '20px', marginLeft: '3px', marginRight: '5px' }} />
                  <p style={{ marginBottom: '0px', fontSize: '20px' }}>{comment.User.nickName} - {new Date(comment.createdAt).toLocaleString('es-AR', { hour12: false })}</p>
                </div>
              </div>
            ))
          }
          {/* Agregar comentarios */}
          {user ? (
            <form onSubmit={agregarComentario} style={{ marginTop: "30px", marginBottom: "20px" }}>
              <textarea className={styles.form} name="Nuevo comentario" placeholder='Esto es lo que opino de tu post: ...' />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type='submit' className='btn btn-success' style={{ backgroundColor: "#53ac59" }}>Publicar comentario</button>
              </div>
            </form>
          ) : (
            <p style={{ color: "#53ac59", fontWeight: "bold", marginLeft: "20px", marginTop: "30px" }}>
              Iniciá sesión para comentar.
            </p>
          )}
        </div>


      </div>
    )
  }


};

export default PostDetail;
