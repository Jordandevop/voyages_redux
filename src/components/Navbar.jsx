import {
  Container,
  Nav,
  Navbar as BootstrapNavbar,
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
    <BootstrapNavbar
      expand="lg"
      className="luxury-navbar"
      data-bs-theme="dark"
    >
      <Container>
        <BootstrapNavbar.Brand as={NavLink} to="/">
          Voyages
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="main-navbar" />

        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-1">
            <Nav.Link as={NavLink} to="/" end>
              Accueil
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              À propos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/destination">
              Destinations
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
                  <Nav.Link as={NavLink} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                )}

                <Nav.Link as={NavLink} to="/favorites">
                  Favoris
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className="d-flex align-items-center gap-2"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      roundedCircle
                      style={{
                        width: "26px",
                        height: "26px",
                        objectFit: "cover",
                        border: "1.5px solid rgba(201,161,74,0.6)",
                      }}
                      alt="Avatar"
                    />
                  ) : (
                    <span
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "26px",
                        height: "26px",
                        background: "rgba(201,161,74,0.18)",
                        fontSize: "0.7rem",
                        border: "1px solid rgba(201,161,74,0.4)",
                        color: "var(--gold)",
                        flexShrink: 0,
                      }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase() || "V"}
                    </span>
                  )}
                  Mon Profil
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Inscription
                </Nav.Link>
                <Button
                  as={NavLink}
                  to="/login"
                  size="sm"
                  className="btn-gold rounded-pill ms-2 px-4"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.06em", padding: "0.45rem 1rem" }}
                >
                  Connexion
                </Button>
              </>
            )}
          </Nav>

          <button
            onClick={() => dispatch(toggleTheme())}
            className="ms-3 border-0 bg-transparent p-1"
            style={{ color: "rgba(201,161,74,0.7)", fontSize: "1rem", cursor: "pointer", lineHeight: 1 }}
            title="Changer de thème"
          >
            {mode === "light" ? "🌙" : "☀️"}
          </button>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
