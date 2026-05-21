import {
  Container,
  Nav,
  Navbar as BootstapNavbar,
  Image,
  Button,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

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

        <BootstapNavbar.Toggle aria-controls="main-navbar" />

        <BootstapNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/">
              Accueil
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              A propos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/destination">
              Nos destinations
            </Nav.Link>
            <Nav.Link as={NavLink} to="/search">
              Rechercher
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>

            {user ? (
              <>
                {user?.role === "admin" && (
                  <Nav.Link as={NavLink} to="/dashboard" className="fw-bold">
                    ⚙️ Dashboard
                  </Nav.Link>
                )}
                <Nav.Link
                  as={NavLink}
                  to="/favorites"
                  className="fw-bold d-flex align-items-center gap-1"
                >
                  ❤️ Favoris
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className="fw-bold d-flex align-items-center gap-2"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      roundedCircle
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        backgroundColor: "white",
                      }}
                      alt="Avatar"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  Mon Profil
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Inscription
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login">
                  Connexion
                </Nav.Link>
              </>
            )}
          </Nav>
          <Button
            variant={mode === "light" ? "outline-dark" : "outline-light"}
            onClick={() => dispatch(toggleTheme())}
            className="rounded-circle ms-3 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            title="Changer de thème"
          >
            {mode === "light" ? "🌙" : "☀️"}
          </Button>
        </BootstapNavbar.Collapse>
      </Container>
    </BootstapNavbar>
  );
}

export default Navbar;
