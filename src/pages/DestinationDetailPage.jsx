import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Row, Col, Badge, Spinner } from "react-bootstrap";
import { apiRequest } from "../api/apiClient";
import FavoriteButton from "../components/FavoriteButton";
import CommentsSection from "../components/CommentsSection";

function DestinationDetailPage() {
  const { slug } = useParams();

  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiRequest(`/destinations/show.php?slug=${slug}`, {
          method: "GET",
        });
        setDestination(data?.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchDestination();
  }, [slug]);

  if (isLoading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <Spinner
          animation="border"
          style={{ width: "3rem", height: "3rem", color: "var(--gold)" }}
        />
        <p className="mt-3 fw-medium" style={{ color: "var(--text-muted)" }}>
          Préparation du voyage…
        </p>
      </div>
    );
  }

  if (error || !destination || Object.keys(destination).length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="text-center" style={{ maxWidth: "520px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🗺️</div>
          <h2
            className="fw-bold mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Destination introuvable
          </h2>
          <p className="mb-4" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
            Il semblerait que cette destination ait disparu de notre carte ou n'existe pas.
          </p>
          <Button
            as={Link}
            to="/destination"
            className="btn-gold rounded-pill px-5 py-3 fw-bold"
          >
            Explorer d'autres horizons
          </Button>
        </div>
      </div>
    );
  }

  const latitude  = destination.lat  || "46.2276";
  const longitude = destination.long || "2.2137";
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=5&output=embed`;

  return (
    <>
      <div className="page-header">
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Button
            as={Link}
            to="/destination"
            variant="link"
            className="p-0 mb-3 d-inline-flex align-items-center gap-2 text-decoration-none"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", letterSpacing: "0.05em" }}
          >
            ← Retour aux destinations
          </Button>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Badge
              className="rounded-pill px-3 py-2 text-white"
              style={{
                background: "rgba(201,161,74,0.25)",
                border: "1px solid rgba(201,161,74,0.4)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {destination.region_name}
            </Badge>
          </div>

          <h1
            className="display-4 fw-bold mt-2 mb-2"
            style={{ fontFamily: "Playfair Display, serif", color: "#fff" }}
          >
            {destination.name}
          </h1>
          <p style={{ color: "var(--gold)", fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.04em", marginBottom: 0 }}>
            ◈ Capitale : {destination.capital}
          </p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-5 align-items-start mb-5">
          <Col lg={6}>
            <div className="detail-hero-wrap">
              <img src={destination.image} alt={destination.name} />
              <div className="detail-hero-overlay" />
              <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
                <FavoriteButton
                  destination={{ ...destination, title: destination.name }}
                />
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <p
              className="fs-5 mb-4"
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.85,
                whiteSpace: "pre-line",
              }}
            >
              {destination.description}
            </p>

            <hr className="gold-divider" style={{ marginBottom: "2rem" }} />

            <div className="d-flex flex-wrap gap-3">
              <Button
                className="btn-gold rounded-pill px-5 py-3 fw-bold shadow"
                style={{ fontSize: "0.9rem" }}
              >
                Réserver ce voyage
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="outline-secondary"
                className="rounded-pill px-5 py-3 fw-semibold"
                style={{ fontSize: "0.9rem" }}
              >
                Nous contacter
              </Button>
            </div>
          </Col>
        </Row>

        <hr style={{ borderColor: "var(--cream-dark)", opacity: 1, marginBottom: "3rem" }} />

        <Row className="g-5">
          <Col lg={7}>
            <span className="section-eyebrow">Géographie</span>
            <h3
              className="section-title h4 mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Situation Géographique
            </h3>
            <div
              className="ratio ratio-16x9 overflow-hidden shadow-sm"
              style={{ borderRadius: "1rem", border: "1px solid var(--cream-dark)" }}
            >
              <iframe
                title={`Carte de ${destination.name}`}
                src={mapUrl}
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </Col>

          <Col lg={5}>
            {destination && <CommentsSection destinationId={destination.id} />}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DestinationDetailPage;
