import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.png";
import "../styles/header.css";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <Navbar style={{backgroundColor: "#53ac59"}} expand="lg" variant="dark" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo} alt="Logo" className="logo-navbar" />
          <span className="ms-2">UnaHur Anti - Social Net</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/profile">Perfil</Nav.Link>
                <Nav.Link as={Link} to="/new-post">Nueva Publicación</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Item className="nav-link text-white">Hola, {user.nickName}</Nav.Item>
                <Button variant="outline-light" size="sm" onClick={logout} style={{ marginTop: "4px" }}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Registro</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;