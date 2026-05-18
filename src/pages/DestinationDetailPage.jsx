import { useParams, Link } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
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
            <Button as={Link} to="/destinationPage" variant="outline-secondary" className="mb-4">
                &larr; Retour
            </Button>
            
            <Row className="align-items-center">
                <Col md={6}>
                    <img 
                        src={destination.image} 
                        alt={destination.name} 
                        className="img-fluid rounded-4 shadow"
                    />
                </Col>
                <Col md={6} className="mt-4 mt-md-0 px-md-5">
                    <span className="text-uppercase text-info fw-bold">{destination.region}</span>
                    <h1 className="display-4 fw-bold mb-3">{destination.name}</h1>
                    <h4 className="text-muted mb-4">Capitale : {destination.capital}</h4>
                    <p className="fs-5">{destination.description}</p>
                    <Button variant="primary" size="lg" className="mt-3 rounded-pill px-4">
                        Réserver ce voyage
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default DestinationDetailPage;