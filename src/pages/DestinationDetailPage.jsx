import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Row, Col, Badge, Card, Spinner } from "react-bootstrap";
import { apiRequest } from "../api/apiClient";
import FavoriteButton from "../components/FavoriteButton";

function DestinationDetailPage() {
    const { slug } = useParams();
    
    const [destination, setDestination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestination = async () => {
            setIsLoading(true);
            setError(null);
            try {
            
                const data = await apiRequest(`/destinations/show.php?slug=${slug}`, { 
                    method: 'GET' 
                });
                
                setDestination(data?.data || data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchDestination();
        }
    }, [slug]);

    if (isLoading) {
        return (
            <Container className="py-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
                <p className="mt-3 text-muted fw-medium">Préparation du voyage...</p>
            </Container>
        );
    }

    if (error || !destination || Object.keys(destination).length === 0) {
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
    const latitude = destination.lat || "46.2276";  
    const longitude = destination.long || "2.2137"; 
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=5&output=embed`;

    return (
        <Container className="py-5">
            <Button as={Link} to="/destination" variant="outline-secondary" className="mb-4 rounded-pill px-4">
                ← Retour aux destinations
            </Button>
            
            <Row className="align-items-center mb-5">
                <Col lg={6} className="mb-4 mb-lg-0">
                    <div className="position-relative">
                        <img 
                            src={destination.image} 
                            alt={destination.name} 
                            className="img-fluid rounded-4 shadow-lg w-100"
                            style={{ objectFit: "cover", maxHeight: "500px" }}
                        />
                        {/* 🆕 Ajout du bouton Favoris sur l'image */}
                        <div className="position-absolute top-0 end-0 p-3">
                            <FavoriteButton destination={{ ...destination, title: destination.name }} />
                        </div>
                    </div>
                </Col>
                
                <Col lg={6} className="px-lg-5">
                    {/* Si l'API renvoie le nom de la région, on l'affiche, sinon on affiche l'ID */}
                    <Badge 
                        bg="info" 
                        className="text-uppercase tracking-wider mb-2 py-2 px-3 rounded-pill text-white text-decoration-none"
                    >
                        {destination.region_name}
                    </Badge>
                    <h1 className="display-4 fw-bold mb-2">{destination.name}</h1>
                    <h4 className="text-muted mb-4">📍 Capitale : {destination.capital}</h4>
                    
                    <p className="fs-5 text-secondary mb-4" style={{ whiteSpace: "pre-line" }}>
                        {destination.description}
                    </p>

                    <Button variant="primary" size="lg" className="rounded-pill px-5 shadow-sm fw-bold">
                        Réserver ce voyage
                    </Button>
                </Col>
            </Row>

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