import { Card, Col, Row, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../index.css";

function HomePage() {
    return (
        <Container className="py-5">
            <section className="mb-5">
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                    <Row className="g-0 align-items-center">
                     
                        <Col lg={6} className="order-2 order-lg-1">
                            <Card.Body className="p-4 p-md-5 mx-xl-3">
                                <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">
                                    ✨ Inspiration de voyage
                                </span>
                                <h1 className="display-4 fw-black mb-3 text-dark lh-sm">
                                    Trouvez votre prochaine <br />
                                    <span className="text-primary text-gradient">destination de rêve</span>
                                </h1>
                                <p className="text-secondary mb-4 fs-5 fw-normal">
                                    Explorez des cultures uniques, des paysages à couper le souffle et 
                                    planifiez le voyage qui vous ressemble à travers notre sélection exclusive de destinations.
                                </p>
                                <div className="d-flex flex-wrap gap-3">
                                    <Button as={Link} to="/destination" variant="primary" size="lg" className="rounded-pill px-4 fw-bold shadow-sm">
                                        Voir les destinations
                                    </Button>
                                    <Button as={Link} to="/search" variant="outline-secondary" size="lg" className="rounded-pill px-4 fw-bold">
                                        Recherche avancée
                                    </Button>
                                </div>
                            </Card.Body>
                        </Col>

                        <Col lg={6} className="order-1 order-lg-2">
                            <div style={{ height: "450px", width: "100%" }}>
                                <img 
                                    className="w-100 h-100"
                                    src="https://cdn.pixabay.com/photo/2020/04/25/18/55/cruise-5092182_1280.jpg" 
                                    alt="Bateau de croisière dans un fjord" 
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Card>
            </section>

            <section className="py-4">
                <Row className="g-4 text-center">
                    <Col md={4}>
                        <Card className="border-0 bg-light p-4 rounded-4 h-100 transition-card">
                            <Card.Body>
                                <div className="fs-1 mb-3">🌍</div>
                                <h5 className="fw-bold text-dark">Destinations uniques</h5>
                                <p className="text-muted small mb-0">
                                    Des itinéraires triés sur le volet, des fjords scandinaves aux temples du Japon.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 bg-light p-4 rounded-4 h-100 transition-card">
                            <Card.Body>
                                <div className="fs-1 mb-3">💎</div>
                                <h5 className="fw-bold text-dark">Budgets transparents</h5>
                                <p className="text-muted small mb-0">
                                    Du voyage économique à l'aventure haut de gamme, sans frais cachés.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="border-0 bg-light p-4 rounded-4 h-100 transition-card">
                            <Card.Body>
                                <div className="fs-1 mb-3">🤝</div>
                                <h5 className="fw-bold text-dark">Experts à votre écoute</h5>
                                <p className="text-muted small mb-0">
                                    Une équipe de passionnés à vos côtés pour concevoir le séjour parfait.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </section>
        </Container>
    );
}

export default HomePage;