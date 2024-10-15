// AppNavbar.js
import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <strong>BtB Blog</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user && user.id !== null ? (
              <>
                {user.isAdmin ?
                  (<Nav.Link as={NavLink} to="/admin" className="nav-link-custom">Admin Dashboard</Nav.Link>)
                  :
                  (
                  <>
                    <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                  </>
                  )
                }
                <Nav.Link as={Link} to="/logout" className="nav-link-custom">Logout</Nav.Link>
                
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
