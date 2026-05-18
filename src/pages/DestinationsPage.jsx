import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { destinations } from "../data/destinations"; 

function DestinationPage() {
    return (
        <Container className="py-5">
          
            <div className="text-center mb-5">
                <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">
                    Le monde vous attend
                </span>
                <h1 className="display-4 fw-bold text-dark mb-3">Nos Destinations</h1>
                <p className="lead text-secondary w-75 mx-auto">
                    Découvrez notre catalogue de voyages soigneusement sélectionnés pour vous offrir des expériences inoubliables.
                </p>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
                {destinations.map((destination) => (
                    <Col key={destination.id}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden destination-card">
                           
                            <div style={{ height: "200px", overflow: "hidden" }}>
                                <Card.Img 
                                    variant="top" 
                                    src={destination.image} 
                                    alt={destination.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            
                            <Card.Body className="d-flex flex-column p-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Card.Title className="fw-bold mb-0 fs-4">
                                        {destination.name}
                                    </Card.Title>
                                    <Badge bg="info" className="rounded-pill px-3 py-2">
                                        {destination.region}
                                    </Badge>
                                </div>
                                
                                <p className="text-muted small mb-3">
                                    📍 Capitale : {destination.capital}
                                </p>
                                
                                <Card.Text className="text-secondary flex-grow-1">
                                    {destination.description}
                                </Card.Text>
                                <Button 
                                    as={Link} 
                                    to={`/destination/${destination.slug}`} 
                                    variant="outline-primary" 
                                    className="w-100 mt-3 rounded-pill fw-bold"
                                >
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

export default DestinationPage;