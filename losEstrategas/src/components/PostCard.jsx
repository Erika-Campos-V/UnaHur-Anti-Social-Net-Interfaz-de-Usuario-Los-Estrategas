import { Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import noImage from "../assets/noImage.png";
import chatBubble from '../assets/mensajero.png';
import noComments from '../assets/mensajeroGris.png';
import clock from '../assets/clock.png';
import usuario from '../assets/usuario.png';
import wrongImage from '../assets/wrongImage.png';
import styles from '../pages/Home/Home.module.css';

const PostCard = ({ post, image, commentsCount }) => (
  <Card style={{ width: '25rem' }}>
    <Card.Body>
      Fecha publicación: {new Date(post.createdAt).toLocaleString('es-AR')}
      <img src={clock} alt="Fecha" style={{ width: '20px', marginLeft: '8px' }} />
    </Card.Body>

    <Card.Img
      variant="top"
      className={styles.cardImg}
      src={image?.url || noImage}
      onError={(img) => { img.target.onerror = null; img.target.src = wrongImage; }}
    />

    <Card.Body>
      <Card.Title>
        {post.User.nickName}
        <img src={usuario} alt="Usuario" style={{ width: '20px', marginLeft: '8px' }} />
      </Card.Title>
      <Card.Text>{post.description}</Card.Text>
    </Card.Body>

    <ListGroup className="list-group-flush">
      <ListGroup.Item>
        Tags: {post.Tags.length > 0
          ? post.Tags.map((tag) => <span className={styles.tag}>{tag.name}</span>)
          : 'Ningún tag asociado'}
      </ListGroup.Item>
      <ListGroup.Item>
        Comentarios: {commentsCount ?? 'Cargando...'}
        <img
          src={commentsCount === 0 ? noComments : chatBubble}
          alt="comentarios"
          style={{ width: '20px', marginLeft: '8px' }}
        />
      </ListGroup.Item>
    </ListGroup>

    <Card.Body>
      <Link to={`/post/${post.id}`} className='btn btn-success'>
        Ver publicación completa
      </Link>
    </Card.Body>
  </Card>
);

export default PostCard;