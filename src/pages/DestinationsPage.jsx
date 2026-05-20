import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDestinations } from "../features/destinations/destinationSlice";
import FavoriteButton from "../components/FavoriteButton";
import { apiRequest } from "../api/apiClient";
import getRegionColor from "../utils/helper"; 

function DestinationPage() {
    const dispatch = useDispatch();
    
    const { items: destinations, status, error } = useSelector((state) => state.destinations);
    
    const [regions, setRegions] = useState([]);

    const [isRegionsLoading, setIsRegionsLoading] = useState(true);

    useEffect(() => {
        if (status === 'waiting' || destinations.length === 0) {
            dispatch(fetchDestinations());
        }

        const loadRegions = async () => {
            try {
                const data = await apiRequest("/regions/index.php", { method: "GET" });
                setRegions(data || []);
            } catch (err) {
                console.error("Impossible de charger les régions", err);
            } finally {
                setIsRegionsLoading(false);
            }
        };
        
        loadRegions();
    }, [dispatch, status, destinations.length]);

    const getRegionDetails = (regionId) => {
        const region = regions.find((r) => String(r.id) === String(regionId));
        return {
            name: region ? region.name : "Région inconnue",
            slug: region ? region.slug : "inconnu"
        };
    };

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

            {error && (
                <Alert variant="danger" className="text-center rounded-3 shadow-sm">
                    Impossible de charger le catalogue : {error}
                </Alert>
            )}

            {status === 'pending' || isRegionsLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted fw-medium">Préparation de vos voyages...</p>
                </div>
            ) : destinations.length === 0 && status === 'success' ? (
                <Alert variant="info" className="text-center shadow-sm border-0">
                    Aucune destination n'est disponible pour le moment.
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {destinations.map((destination) => {
                        const regionDetails = getRegionDetails(destination.region_id);

                        return (
                            <Col key={destination.id}>
                                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden destination-card">
                                
                                    <div className="position-relative" style={{ height: "220px", overflow: "hidden" }}>
                                        <Card.Img 
                                            variant="top" 
                                            src={destination.image} 
                                            alt={destination.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        
                                        <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
                                            <FavoriteButton 
                                                destination={{ ...destination, title: destination.name }} 
                                            />
                                        </div>
                                    </div>
                                    
                                    <Card.Body className="d-flex flex-column p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <Card.Title className="fw-bold mb-0 fs-4">
                                                {destination.name}
                                            </Card.Title>
                                            
                                            <Badge 
                                                as={Link}
                                                to={`/region/${regionDetails.slug}`}
                                                bg={getRegionColor(regionDetails.name)} 
                                                className="rounded-pill px-3 py-2 text-white shadow-sm text-decoration-none"
                                            >
                                                {regionDetails.name}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-muted small mb-3 fw-semibold">
                                            📍 Capitale : {destination.capital}
                                        </p>
                                        
                                        <Card.Text className="text-secondary flex-grow-1">
                                            {destination.description?.length > 90 
                                                ? `${destination.description.substring(0, 90)}...` 
                                                : destination.description}
                                        </Card.Text>

                                        <hr className="text-muted opacity-25 my-3" />
                                        
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
                        );
                    })}
                </Row>
            )}
        </Container>
    );
}

export default DestinationPage;