import { useParams, Link } from "react-router-dom";
import { Container, Button, Row, Col, Badge, Card } from "react-bootstrap";
import { destinations } from "../data/destinations";

function DestinationDetailPage() {
    const { slug } = useParams();
    
    const destination = destinations.find(
        (dest) => dest.slug.toLowerCase() === slug?.toLowerCase()
    );

    if (!destination) {
        return (
            <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <Card className="text-center border-0 shadow-lg rounded-4 p-4 p-md-5" style={{ maxWidth: "600px" }}>
                    <Card.Body>
                        <div className="display-1 mb-4">🗺️</div>
                        <h2 className="fw-bold text-dark mb-3">Destination introuvable</h2>
                        <p className="text-muted fs-5 mb-4">
                            Il semblerait que cette destination ait disparu de notre carte ou n'existe pas.
                        </p>
                        <Button as={Link} to="/destination" variant="primary" size="lg" className="rounded-pill px-5 shadow-sm fw-bold">
                            Explorer d'autres horizons
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const latitude = destination.latitude || "46.2276";  
    const longitude = destination.longitude || "2.2137"; 

    const mapUrl = (destination.latitude && destination.longitude)
        ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=5&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(destination.name)}&z=5&output=embed`;

    return (
        <Container className="py-5">
            <Button as={Link} to="/destination" variant="outline-secondary" className="mb-4 rounded-pill px-4">
                &larr; Retour aux destinations
            </Button>
            
            <Row className="align-items-center mb-5">
                <Col lg={6} className="mb-4 mb-lg-0">
                    <img 
                        src={destination.image} 
                        alt={destination.name} 
                        className="img-fluid rounded-4 shadow-lg w-100"
                        style={{ objectFit: "cover", maxHeight: "500px" }}
                    />
                </Col>
                
                <Col lg={6} className="px-lg-5">
                    <Badge 
                        as={Link}
                        to={`/region/${destination.regionSlug}`}
                        bg="info" 
                        className="text-uppercase tracking-wider mb-2 py-2 px-3 rounded-pill text-white text-decoration-none"
                    >
                        {destination.region}
                    </Badge>
                    <h1 className="display-4 fw-bold mb-2">{destination.name}</h1>
                    <h4 className="text-muted mb-4">📍 Capitale : {destination.capital}</h4>
                    
                    <p className="fs-5 text-secondary mb-4">
                        {destination.description}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">🗣️ {destination.language}</Badge>
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">💱 {destination.currency}</Badge>
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">💰 Budget : {destination.budget}</Badge>
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">🕒 {destination.timezone}</Badge>
                    </div>

                    <Button variant="primary" size="lg" className="rounded-pill px-5 shadow-sm fw-bold">
                        Réserver ce voyage
                    </Button>
                </Col>
            </Row>

            <hr />
            
            <div className="mt-5 mb-5 pt-4">
                <h3 className="fw-bold mb-4">Informations pratiques</h3>
                <Row className="g-4">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm bg-light rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">☀️ Climat</h5>
                                <Card.Text className="text-muted">{destination.climate}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm bg-light rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">📅 Meilleure saison</h5>
                                <Card.Text className="text-muted">{destination.bestSeason}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm bg-light rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">🛂 Formalités (Visa)</h5>
                                <Card.Text className="text-muted">{destination.visa}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <hr />
            <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">🌍 Situation Géographique</h3>
                </div>
                
                <div className="ratio ratio-21x9 rounded-4 overflow-hidden shadow-sm border">
                    <iframe
                        title={`Carte de navigation pour ${destination.name}`}
                        src={mapUrl}
                        loading="lazy"
                        allowFullScreen=""
                        referrerPolicy="no-referrer-when-downgrade"
                        style={{ border: 0 }}
                    ></iframe>
                </div>
            </div>
        </Container>
    );
}

export default DestinationDetailPage;