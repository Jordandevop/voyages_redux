import { useParams, Link } from "react-router-dom";
import { Container, Button, Row, Col, Badge, Card } from "react-bootstrap";
import { destinations } from "../data/destinations";

function DestinationDetailPage() {
    
    const { slug } = useParams();
    const destination = destinations.find((dest) => dest.slug === slug);

    if (!destination) {
        return (
            <Container className="py-5 text-center">
                <h2>Destination introuvable</h2>
                <Button as={Link} to="/destinations" variant="primary" className="mt-3">
                    Retour aux destinations
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">

            <Button as={Link} to="/destinationPage" variant="outline-secondary" className="mb-4 rounded-pill px-4">
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
                    <Badge bg="info" className="text-uppercase tracking-wider mb-2 py-2 px-3 rounded-pill">
                        {destination.region}
                    </Badge>
                    <h1 className="display-4 fw-bold mb-2">{destination.name}</h1>
                    <h4 className="text-muted mb-4">📍 Capitale : {destination.capital}</h4>
                    
                    <p className="fs-5 text-secondary mb-4">
                        {destination.description}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">
                            🗣️ {destination.language}
                        </Badge>
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">
                            💱 {destination.currency}
                        </Badge>
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">
                            💰 Budget : {destination.budget}
                        </Badge>
                        <Badge bg="light" text="dark" className="border py-2 px-3 rounded-pill">
                            🕒 {destination.timezone}
                        </Badge>
                    </div>

                    <Button variant="primary" size="lg" className="rounded-pill px-5 shadow-sm fw-bold">
                        Réserver ce voyage
                    </Button>
                </Col>
            </Row>

            <div className="mt-5 pt-4 border-top">
                <h3 className="fw-bold mb-4">Informations pratiques</h3>
                <Row className="g-4">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm bg-light rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">☀️ Climat</h5>
                                <Card.Text className="text-muted">
                                    {destination.climate}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm bg-light rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">📅 Meilleure saison</h5>
                                <Card.Text className="text-muted">
                                    {destination.bestSeason}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm bg-light rounded-4">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">🛂 Formalités (Visa)</h5>
                                <Card.Text className="text-muted">
                                    {destination.visa}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Container>
    );
}

export default DestinationDetailPage;