import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function AboutPage() {
    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">
                    Découvrez notre agence
                </span>
                <h1 className="display-4 fw-bold text-dark mb-3">À propos de nous</h1>
                <p className="lead text-secondary w-75 mx-auto">
                    Notre mission est de transformer vos rêves d'évasion en souvenirs inoubliables. 
                    Découvrez qui se cache derrière votre prochaine grande aventure.
                </p>
            </div>

            <Row className="align-items-center mb-5 pb-4">
                <Col md={6}>
                    <img 
                        src="https://cdn.pixabay.com/photo/2016/01/09/18/27/journey-1130732_1280.jpg" 
                        alt="kit du voyageurs carte, photo, loupe , appareil photo." 
                        className="img-fluid rounded-4 shadow"
                    />
                </Col>
                <Col md={6} className="mt-4 mt-md-0 px-md-5">
                    <h2 className="fw-bold mb-4">Notre Histoire</h2>
                    <p className="text-muted fs-5">
                        Nés de la passion de découvrir de nouveaux horizons, nous avons créé cette 
                        plateforme pour partager les merveilles du monde avec vous. Depuis nos débuts, 
                        notre objectif est de faciliter l'accès à des cultures uniques et des paysages 
                        à couper le souffle.
                    </p>
                    <p className="text-muted fs-5">
                        Chaque itinéraire que nous proposons est soigneusement sélectionné par nos 
                        experts locaux pour vous garantir une expérience authentique, sécurisée et 
                        respectueuse de l'environnement.
                    </p>
                </Col>
            </Row>

            {/* Section Valeurs (3 Colonnes) */}
            <h3 className="text-center fw-bold mb-4">Pourquoi nous choisir ?</h3>
            <Row className="text-center g-4 mb-5">
                <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm bg-light p-3 rounded-4">
                        <Card.Body>
                            <div className="display-4 mb-3">🌍</div>
                            <Card.Title className="fw-bold">Destinations Uniques</Card.Title>
                            <Card.Text className="text-muted">
                                Des lieux hors des sentiers battus pour des expériences que vous ne trouverez nulle part ailleurs.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm bg-light p-3 rounded-4">
                        <Card.Body>
                            <div className="display-4 mb-3">🤝</div>
                            <Card.Title className="fw-bold">Accompagnement Sur Mesure</Card.Title>
                            <Card.Text className="text-muted">
                                Une équipe experte, dédiée à l'écoute de vos envies pour créer le voyage qui vous correspond.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm bg-light p-3 rounded-4">
                        <Card.Body>
                            <div className="display-4 mb-3">🌱</div>
                            <Card.Title className="fw-bold">Tourisme Responsable</Card.Title>
                            <Card.Text className="text-muted">
                                Nous nous engageons à voyager de manière éthique, en soutenant les communautés locales.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="text-center mt-5 p-4 bg-primary text-white rounded-4 shadow">
                <h3 className="mb-3">Prêt à partir à l'aventure ?</h3>
                <p className="mb-4">Consultez nos destinations ou contactez-nous pour organiser votre voyage idéal.</p>
                <Button as={Link} to="/destinationPage" variant="light" size="lg" className="px-5 fw-bold text-primary rounded-pill">
                    Voir les destinations
                </Button>
            </div>
        </Container>
    );
}

export default AboutPage;