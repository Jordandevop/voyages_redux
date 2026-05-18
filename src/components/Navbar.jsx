import { Container, Nav, Navbar as BootstapNavbar} from "react-bootstrap"
import { NavLink } from "react-router-dom"

function Navbar(){

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
                        <Nav.Link as={NavLink} to= '/'>
                            Accueil                        
                        </Nav.Link>
                    </Nav>

                </BootstapNavbar.Collapse>
            </Container>
            
        </BootstapNavbar>
    )

}

export default Navbar;