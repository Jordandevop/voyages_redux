import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { destinations } from "../data/destinations";


function RegionPage() {
    const { regionName } = useParams();
    const navigate = useNavigate();

    const filteredDestinations = destinations.filter(
        (dest) => dest.regionSlug === regionName?.toLowerCase()
    );

    const realRegionName = filteredDestinations.length > 0 ? filteredDestinations[0].region : regionName;

    if (filteredDestinations.length === 0) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="danger" className="rounded-4 py-5 shadow-sm border-0 mx-auto" style={{ maxWidth: "600px" }}>
                    <div className="display-1 mb-3">🧭</div>
                    <h3 className="fw-bold">Région inconnue</h3>
                    <p className="text-muted mb-4">Nous n'avons pas de voyages répertoriés pour cette zone géographique.</p>
                    <Button as={Link} to="/destination" variant="danger" className="rounded-pill px-4 fw-bold">
                        Retour aux destinations
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Button onClick={() => navigate(-1)} variant="outline-secondary" className="mb-4 rounded-pill px-4 fw-bold">
                &larr; Retour
            </Button>

            <div className="mb-5">
                <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">
                    Exploration par continent
                </span>
                <h1 className="display-4 fw-bold text-dark">
                    Voyages en <span className="text-capitalize">{realRegionName}</span>
                </h1>
                <p className="lead text-secondary">
                    Découvrez toutes nos escales disponibles en {realRegionName}.
                </p>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
                {filteredDestinations.map((destination) => (
                    <Col key={destination.id}>
                        <Card 
                            onClick={() => navigate(`/destination/${destination.slug}`)} 
                            style={{ cursor: "pointer" }}
                            className="h-100 border-0 shadow-sm rounded-4 overflow-hidden destination-card"
                        >
                            <div style={{ height: "220px", overflow: "hidden" }}>
                                <Card.Img 
                                    variant="top" 
                                    src={destination.image} 
                                    alt={destination.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <Card.Body className="d-flex flex-column p-4">
                                <Card.Title className="fw-bold mb-2 fs-4">{destination.name}</Card.Title>
                                <p className="text-muted small mb-3 fw-semibold">📍 Capitale : {destination.capital}</p>
                                <Card.Text className="text-secondary flex-grow-1">
                                    {destination.description.length > 90 
                                        ? `${destination.description.substring(0, 90)}...` 
                                        : destination.description}
                                </Card.Text>
                                <hr className="text-muted opacity-25 my-3" />
                                <div className="d-flex justify-content-between align-items-center mb-3 small text-muted fw-medium">
                                    <span>💰 Budget : {destination.budget.split(',')[0]}</span>
                                    <span>🗣️ {destination.language.split(' ')[0]}</span>
                                </div>
                                <Button variant="outline-primary" className="w-100 mt-auto rounded-pill fw-bold pointer-events-none">
                                    Découvrir {destination.name}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default RegionPage;