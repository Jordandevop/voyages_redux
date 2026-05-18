import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { destinations } from "../data/destinations"; 
import getRegionColor from "../utils/helper";

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
                           
                            <div style={{ height: "220px", overflow: "hidden" }}>
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
                                    
                                    <Badge 
                                        as={Link}
                                        to={`/region/${destination.regionSlug}`}
                                        bg={getRegionColor(destination.region)} 
                                        className="rounded-pill px-3 py-2 text-white shadow-sm"
                                    >
                                        {destination.region}
                                    </Badge>
                                </div>
                                
                                <p className="text-muted small mb-3 fw-semibold">
                                    📍 Capitale : {destination.capital}
                                </p>
                                
                                <Card.Text className="text-secondary flex-grow-1">
                                    {destination.description.length > 90 
                                        ? `${destination.description.substring(0, 90)}...` 
                                        : destination.description}
                                </Card.Text>

                                <hr className="text-muted opacity-25 my-3" />
                                <div className="d-flex justify-content-between align-items-center mb-3 small text-muted fw-medium">
                                    <span title={destination.budget}>💰 Budget : {destination.budget.split(',')[0]}</span>
                                    <span title={destination.language}>🗣️ {destination.language.split(' ')[0]}</span>
                                </div>
                                
                                <Button 
                                    as={Link} 
                                    to={`/destination/${destination.slug}`} 
                                    variant="outline-primary" 
                                    className="w-100 mt-auto rounded-pill fw-bold"
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