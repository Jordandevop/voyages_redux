import { Container, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../index.css";

const FEATURES = [
  {
    icon: "✦",
    title: "Destinations Exclusives",
    desc: "Des itinéraires triés sur le volet, des fjords scandinaves aux temples du Japon.",
  },
  {
    icon: "◈",
    title: "Expériences Sur Mesure",
    desc: "Du voyage intime à l'aventure haut de gamme, conçu selon vos envies et votre budget.",
  },
  {
    icon: "❋",
    title: "Experts à Votre Écoute",
    desc: "Une équipe de passionnés dédiée à concevoir le séjour parfait pour vous.",
  },
];

function HomePage() {
  return (
    <>
      
      <section className="hero-section">
        <div
          className="hero-bg"
          style={{
            backgroundImage:
              "url('https://cdn.pixabay.com/photo/2020/04/25/18/55/cruise-5092182_1280.jpg')",
          }}
        />
        <div className="hero-overlay" />

        <Container className="hero-content">
          <Row>
            <Col lg={7} xl={6} className="fade-in-up">
              <span className="hero-eyebrow">Agence de voyages premium</span>
              <h1 className="hero-title">
                L'art de voyager<br />
                <em>sans frontières</em>
              </h1>
              <p className="hero-subtitle">
                Explorez des cultures uniques, des paysages à couper le souffle
                et planifiez le voyage qui vous ressemble à travers notre
                sélection exclusive de destinations.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button
                  as={Link}
                  to="/destination"
                  className="btn-gold rounded-pill px-5 py-3 fw-bold shadow"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  Nos Destinations
                </Button>
                <Button
                  as={Link}
                  to="/search"
                  className="btn-outline-white rounded-pill px-5 py-3 fw-bold"
                  style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
                >
                  Recherche Avancée
                </Button>
              </div>
            </Col>
          </Row>
        </Container>

        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
          <span>Découvrir</span>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "6rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <span className="section-eyebrow">Pourquoi nous choisir</span>
            <h2 className="section-title display-6 mb-3">
              Une expérience voyage<br />exceptionnelle
            </h2>
            <hr className="gold-divider mx-auto" />
          </div>

          <Row className="g-4">
            {FEATURES.map((f, i) => (
              <Col md={4} key={i}>
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h5
                    className="fw-bold mb-2"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {f.title}
                  </h5>
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}
                  >
                    {f.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section
        style={{
          background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)",
          padding: "5.5rem 0",
        }}
      >
        <Container className="text-center">
          <span className="section-eyebrow">Prêt pour l'aventure ?</span>
          <h2
            className="display-5 fw-bold mb-3 mt-2"
            style={{ fontFamily: "Playfair Display, serif", color: "#fff" }}
          >
            Votre prochain voyage<br />commence ici
          </h2>
          <p
            className="mb-4 mx-auto"
            style={{
              color: "rgba(255,255,255,0.65)",
              maxWidth: "460px",
              lineHeight: 1.75,
            }}
          >
            Parcourez notre catalogue de destinations exclusives et planifiez
            l'escapade dont vous avez toujours rêvé.
          </p>
          <Button
            as={Link}
            to="/destination"
            className="btn-gold rounded-pill px-5 py-3 fw-bold shadow-lg"
            style={{ fontSize: "0.95rem" }}
          >
            Explorer le catalogue
          </Button>
        </Container>
      </section>
    </>
  );
}

export default HomePage;
