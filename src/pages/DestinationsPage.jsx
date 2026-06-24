import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDestinations } from "../features/destinations/destinationSlice";
import FavoriteButton from "../components/FavoriteButton";
import { apiRequest } from "../api/apiClient";

function DestinationPage() {
  const dispatch = useDispatch();
  const { items: destinations, status, error } = useSelector((state) => state.destinations);

  const [regions, setRegions] = useState([]);
  const [isRegionsLoading, setIsRegionsLoading] = useState(true);

  useEffect(() => {
    if (status === "waiting" || destinations.length === 0) {
      dispatch(fetchDestinations());
    }
    const loadRegions = async () => {
      try {
        const data = await apiRequest("/regions/index.php", { method: "GET" });
        setRegions(data || []);
      } catch (err) {
        console.error("Impossible de charger les régions", err);
      } finally {
        setIsRegionsLoading(false);
      }
    };
    loadRegions();
  }, [dispatch, status, destinations.length]);

  const getRegionDetails = (regionId) => {
    const region = regions.find((r) => String(r.id) === String(regionId));
    return {
      name: region ? region.name : "Région inconnue",
      slug: region ? region.slug : "inconnu",
    };
  };

  return (
    <>
      <div className="page-header">
        <Container style={{ position: "relative", zIndex: 2 }}>
          <span className="section-eyebrow">Le monde vous attend</span>
          <h1
            className="display-4 fw-bold mt-2 mb-3"
            style={{ fontFamily: "Playfair Display, serif", color: "#fff" }}
          >
            Nos Destinations
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", maxWidth: "520px", lineHeight: 1.75, marginBottom: 0 }}>
            Découvrez notre catalogue de voyages soigneusement sélectionnés
            pour vous offrir des expériences inoubliables.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {error && (
          <Alert variant="danger" className="text-center rounded-3 shadow-sm border-0 mb-4">
            Impossible de charger le catalogue : {error}
          </Alert>
        )}

        {status === "pending" || isRegionsLoading ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              style={{ color: "var(--gold)", width: "3rem", height: "3rem" }}
            />
            <p className="mt-3 fw-medium" style={{ color: "var(--text-muted)" }}>
              Préparation de vos voyages...
            </p>
          </div>
        ) : destinations.length === 0 && status === "success" ? (
          <Alert variant="info" className="text-center shadow-sm border-0 rounded-4">
            Aucune destination n'est disponible pour le moment.
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {destinations.map((destination) => {
              const regionDetails = getRegionDetails(destination.region_id);
              return (
                <Col key={destination.id}>
                  <Card className="luxury-card h-100">
                    <div className="destination-card-image-wrap">
                      <img src={destination.image} alt={destination.name} />
                      <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
                        <FavoriteButton
                          destination={{ ...destination, title: destination.name }}
                        />
                      </div>
                      <Badge
                        as={Link}
                        to={`/region/${regionDetails.slug}`}
                        className="position-absolute bottom-0 start-0 m-3 rounded-pill text-white text-decoration-none"
                        style={{
                          background: "rgba(13,27,42,0.72)",
                          backdropFilter: "blur(6px)",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          padding: "0.4rem 0.85rem",
                        }}
                      >
                        {regionDetails.name}
                      </Badge>
                    </div>
                    <Card.Body className="d-flex flex-column p-4">
                      <h5
                        className="fw-bold mb-1"
                        style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem" }}
                      >
                        {destination.name}
                      </h5>
                      <p
                        className="mb-3"
                        style={{ fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600, letterSpacing: "0.04em" }}
                      >
                        ◈ {destination.capital}
                      </p>
                      <p
                        className="flex-grow-1 mb-4"
                        style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65 }}
                      >
                        {destination.description?.length > 100
                          ? `${destination.description.substring(0, 100)}…`
                          : destination.description}
                      </p>
                      <Button
                        as={Link}
                        to={`/destination/${destination.slug}`}
                        className="w-100 rounded-pill fw-bold"
                        style={{
                          background: "var(--navy)",
                          border: "none",
                          color: "#fff",
                          fontSize: "0.85rem",
                          letterSpacing: "0.04em",
                          padding: "0.65rem 1rem",
                          transition: "var(--transition)",
                        }}
                      >
                        Découvrir
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
}

export default DestinationPage;
