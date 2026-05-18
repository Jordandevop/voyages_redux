import { Card, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../index.css";

function HomePage() {
    return (
        <>
            <section className="py-5">
                <Card className="border-0 shadow-sm overflow-hidden bg-light">
                    <Row className="g-0 align-items-center">
                    
                        <Col md={6} className="order-2 order-md-1">
                            <Card.Body className="p-4 p-md-5">
                                <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">
                                    Inspiration de voyage
                                </span>
                                <h1 className="display-5 fw-bold mb-3 text-dark">
                                    Trouvez votre prochaine <br />
                                    <span className="text-primary">destination de rêve</span>
                                </h1>
                                <p className="text-secondary mb-4 fs-5">
                                    Explorez des cultures uniques, des paysages à couper le souffle et 
                                    planifiez le voyage qui vous ressemble à travers notre sélection exclusive.
                                </p>
                                <Button as={Link} to="/" variant="primary" size="lg" className="px-4 py-2 shadow-sm">
                                    Voir les destinations
                                </Button>
                            </Card.Body>
                        </Col>

                        
                        <Col md={6} className="order-1 order-md-2 d-flex align-items-stretch">
                            <img 
                                className="home-image"
                                src="https://cdn.pixabay.com/photo/2020/04/25/18/55/cruise-5092182_1280.jpg" 
                                alt="Bateau de croisière dans un fjord" 
                            
                            />
                        </Col>
                    </Row>
                </Card>
            </section>
        </>
    );
}

export default HomePage;