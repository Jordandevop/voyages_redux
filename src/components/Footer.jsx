import {
  Container, Row, Col, Card, Form, Button,
  Spinner, Alert, Image, Tab, Nav,
  NavLink,
} from "react-bootstrap";

function Footer() {
  return (
    <footer className="luxury-footer py-5 mt-auto">
      <Container>
        <Row className="g-4 mb-4">
          <Col md={4}>
            <div className="footer-brand mb-3">Voyages</div>
            <p className="mb-0" style={{ fontSize: "0.875rem", lineHeight: 1.75 }}>
              Découvrez le monde avec élégance. Des expériences uniques,
              soigneusement sélectionnées pour les voyageurs exigeants.
            </p>
          </Col>

          <Col md={2} xs={6}>
            <div className="footer-heading">Explorer</div>
            <div className="d-flex flex-column gap-2">
              <NavLink to="/destination">Destinations</NavLink>
              <NavLink to="/search">Rechercher</NavLink>
              <NavLink to="/about">À propos</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </Col>

          <Col md={2} xs={6}>
            <div className="footer-heading">Compte</div>
            <div className="d-flex flex-column gap-2">
              <NavLink to="/login">Connexion</NavLink>
              <NavLink to="/register">Inscription</NavLink>
              <NavLink to="/favorites">Mes favoris</NavLink>
              <NavLink to="/profile">Mon profil</NavLink>
            </div>
          </Col>

          <Col md={4}>
            <div className="footer-heading">Une question ?</div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.75 }} className="mb-2">
              Notre équipe est disponible pour concevoir
              le voyage de vos rêves, sur mesure.
            </p>
            <NavLink to="/contact" style={{ color: "var(--gold)", fontWeight: 600, fontSize: "0.875rem" }}>
              Nous contacter →
            </NavLink>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span style={{ fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} Voyages. Tous droits réservés.
          </span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;