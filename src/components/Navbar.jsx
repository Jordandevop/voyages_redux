import { Container, Nav, Navbar as BootstapNavbar, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

function Navbar() {

    const { isAuthenticated, user } = useAuth(); 
    
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
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={NavLink} to='/'>Accueil</Nav.Link>
                        <Nav.Link as={NavLink} to="/about">A propos</Nav.Link>
                        <Nav.Link as={NavLink} to='/destination'>Nos destinations</Nav.Link>
                        <Nav.Link as={NavLink} to='/search'>Rechercher</Nav.Link>
                        <Nav.Link as={NavLink} to='/contact'>Contact</Nav.Link>

                        {isAuthenticated ? (
                            <Nav.Link as={NavLink} to='/profile' className="fw-bold d-flex align-items-center gap-2">
                                
                                {user?.image ? (
                                    <Image 
                                        src={user.image} 
                                        roundedCircle 
                                        style={{ width: "30px", height: "30px", objectFit: "cover", backgroundColor: "white" }}
                                        alt="Avatar"
                                    />
                                ) : (
                                    <span>👤</span> 
                                )}
                                
                                Mon Profil
                            </Nav.Link>
                        ) : (
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