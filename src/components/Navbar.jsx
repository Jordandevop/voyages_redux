import { Container, Nav, Navbar as BootstapNavbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

function Navbar() {
   
    const { isAuthenticated } = useAuth(); 

    return (
        <BootstapNavbar 
            bg="primary"
            data-bs-theme="dark"
            expand="lg"
            className="shadow-sm"
        >
            <Container>
                <BootstapNavbar.Brand as={NavLink} to="/">
                    Voyages
                </BootstapNavbar.Brand>
                
                <BootstapNavbar.Toggle aria-controls="main-navbar"/>
                
                <BootstapNavbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to='/'>
                            Accueil                        
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about">
                            A propos
                        </Nav.Link>
                        <Nav.Link as={NavLink} to='/destination'>
                            Nos destinations
                        </Nav.Link>
                        <Nav.Link as={NavLink} to='/search'>
                            Rechercher
                        </Nav.Link>
                        <Nav.Link as={NavLink} to='/contact'>
                            Contact
                        </Nav.Link>

                        {isAuthenticated ? (
                            // S'il est connecté
                            <Nav.Link as={NavLink} to='/profile' className="fw-bold text-warning">
                                👤 Mon Profil
                            </Nav.Link>
                        ) : (
                            // S'il n'est pas connecté
                            <>
                                <Nav.Link as={NavLink} to='/register'>
                                    Inscription
                                </Nav.Link>
                                <Nav.Link as={NavLink} to='/login'>
                                    Connexion
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </BootstapNavbar.Collapse>
            </Container>
        </BootstapNavbar>
    );
}

export default Navbar;