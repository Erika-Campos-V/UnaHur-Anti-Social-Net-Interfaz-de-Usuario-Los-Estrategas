import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import styles from "./PostDetail.module.css"
import noImage from "../../assets/noImage.png"
import wrongImage from "../../assets/wrongImage.png"
import clock from "../../assets/clock.png"
import user from "../../assets/usuario.png"

const PostDetail = () => {

  const { id } = useParams()

  //Para guardar el post - CREO QUE NO SE USA
  const [post, setPost] = useState(null)

  //Para guardar las imagenes del post
  const [images, setImages] = useState([])

  async function getPostById() {
    try {

      const data = await fetch(`http://localhost:3001/posts/${id}`)
      if (!data.ok) {
        throw new Error('Error al consultar la base de datos, razon: ' + data.status)
      }
      const postObtenido = await data.json()
      setPost(postObtenido)

      //console.log(postObtenido)

      const res = await fetch(`http://localhost:3001/postImages/post/${postObtenido.id}`)
      const images = await res.json()

      //console.log(images)

      setImages(images)

    } catch (error) {
      throw new Error('Error en la consulta a la base de datos, razon: ' + error)
    }
  }

  //El codigo solamente se guarda el posts una unica vez
  //Para que no este haciendo fetch a cada rato
  useEffect(() => {
    getPostById();
  }, [])

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
                  style={{height: 400, objectFit: 'contain'}}/>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        {/* Informacion del post, fecha, usuario, desc, comentarios */}
        <div className={styles.prueba}>

          {/* Informacion de fecha */}
          <div style={{display:'flex', alignItems: 'center', paddingTop: '5px', borderBottom: '2px solid #53ac59'}}>
            <img src={clock} alt="reloj" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }}/>
            <p style={{marginBottom: '0px'}}>Fecha publicacion: {new Date(post.createdAt).toLocaleString('es-AR')}</p>
          </div>
          
          {/* Usuario */}
          <div style={{display:'flex', alignItems: 'center', paddingTop: '5px', borderBottom: '2px solid #53ac59'}}>
            <img src={user} alt="icono de usuario" style={{ width: '25px', height: '25px', marginLeft: '3px', marginRight: '5px' }}/>
            <p style={{marginBottom: '0px'}}>Usuario: {post.User.nickName}</p>
          </div>
          
          <p style={{fontWeight: 'bolder', fontSize: '30px', marginLeft: '10px'}}>
            {post.description}
          </p>

          <p>Div Prueba 2</p>
        </div>
      </div>
    )
  } else {
    return (
      <p>no hay imajjjjnes</p>
    )
  }

  // return (
  //   <div className={styles.grid}>
  //     <div>
  //       <Carousel>
  //         {images.map((imagen) => (
  //           <Carousel.Item className={styles.prueba}>
  //             <img src={imagen.url || noImage} alt="Imagen" className="d-block mx-auto" 
  //             onError={img => { img.target.onerror = null; img.target.src = wrongImage; }}/>
  //           </Carousel.Item>
  //         ))}
  //       </Carousel>
  //     </div>
  //     <div>
  //       <p>Div Prueba 2</p>
  //     </div>
  //   </div>
  // );
};

{/* <h2>Detalle de la Publicación</h2>
<p>Acá se mostrará el contenido completo del post, imágenes y comentarios.</p>
<p>{!post
  ? <p>Cargando...</p>
  : <p>post obtenido: {post.description}</p>
}</p> */}

export default PostDetail;
