import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const VALUES = [
  {
    icon: "✦",
    title: "Destinations Uniques",
    desc: "Des lieux hors des sentiers battus pour des expériences que vous ne trouverez nulle part ailleurs.",
  },
  {
    icon: "◈",
    title: "Accompagnement Sur Mesure",
    desc: "Une équipe experte, dédiée à l'écoute de vos envies pour créer le voyage qui vous correspond.",
  },
  {
    icon: "❋",
    title: "Tourisme Responsable",
    desc: "Nous nous engageons à voyager de manière éthique, en soutenant les communautés locales.",
  },
];

function AboutPage() {
  return (
    <>
      <div className="page-header">
        <Container style={{ position: "relative", zIndex: 2 }}>
          <span className="section-eyebrow">Découvrez notre agence</span>
          <h1
            className="display-4 fw-bold mt-2 mb-3"
            style={{ fontFamily: "Playfair Display, serif", color: "#fff" }}
          >
            À propos de nous
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", maxWidth: "520px", lineHeight: 1.75, marginBottom: 0 }}>
            Notre mission est de transformer vos rêves d'évasion en souvenirs inoubliables.
          </p>
        </Container>
      </div>

      <Container className="py-5">
       
        <Row className="align-items-center g-5 mb-5 pb-3">
          <Col lg={6}>
            <div
              style={{
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "var(--card-shadow-hover)",
                height: "420px",
              }}
            >
              <img
                src="https://cdn.pixabay.com/photo/2016/01/09/18/27/journey-1130732_1280.jpg"
                alt="Kit du voyageur"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </Col>

          <Col lg={6}>
            <span className="section-eyebrow">Notre histoire</span>
            <h2
              className="section-title display-6 fw-bold mb-3"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Nés de la passion<br />
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>d'explorer le monde</em>
            </h2>
            <hr className="gold-divider mb-4" />
            <p className="mb-3" style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "1rem" }}>
              Nés de la passion de découvrir de nouveaux horizons, nous avons créé cette
              plateforme pour partager les merveilles du monde avec vous. Depuis nos débuts,
              notre objectif est de faciliter l'accès à des cultures uniques et des paysages
              à couper le souffle.
            </p>
            <p className="mb-4" style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "1rem" }}>
              Chaque itinéraire que nous proposons est soigneusement sélectionné par nos
              experts locaux pour vous garantir une expérience authentique, sécurisée et
              respectueuse de l'environnement.
            </p>
            <Button
              as={Link}
              to="/destination"
              className="btn-gold rounded-pill px-5 py-3 fw-bold shadow-sm"
            >
              Découvrir nos destinations
            </Button>
          </Col>
        </Row>

      
        <div className="text-center mb-5 pt-3">
          <span className="section-eyebrow">Nos engagements</span>
          <h2
            className="section-title display-6 fw-bold mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Pourquoi nous choisir ?
          </h2>
          <hr className="gold-divider mx-auto" />
        </div>

        <Row className="g-4 mb-5">
          {VALUES.map((v, i) => (
            <Col md={4} key={i}>
              <div className="feature-card text-center">
                <div className="feature-icon mx-auto">{v.icon}</div>
                <h5 className="fw-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  {v.title}
                </h5>
                <p className="mb-0" style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </div>
            </Col>
          ))}
        </Row>
        <div
          className="text-center rounded-4 px-4 py-5 shadow-sm"
          style={{
            background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)",
          }}
        >
          <span className="section-eyebrow">Prêt à partir ?</span>
          <h3
            className="fw-bold mb-3 mt-2"
            style={{ fontFamily: "Playfair Display, serif", color: "#fff", fontSize: "1.8rem" }}
          >
            Planifiez votre voyage idéal
          </h3>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.6)", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
            Consultez nos destinations ou contactez-nous pour un séjour sur mesure.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button
              as={Link}
              to="/destination"
              className="btn-gold rounded-pill px-5 py-3 fw-bold"
            >
              Voir les destinations
            </Button>
            <Button
              as={Link}
              to="/contact"
              className="btn-outline-white rounded-pill px-5 py-3 fw-bold"
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}

export default AboutPage;
