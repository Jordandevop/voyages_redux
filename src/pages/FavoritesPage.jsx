import { useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFavorites, removeFavorite } from "../features/favorites/favoriteSlice";

function FavoritesPage() {
    const dispatch = useDispatch();

    const { favorites, status, error } = useSelector((state) => state.favorites);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && user.id) {
            dispatch(fetchFavorites(user.id));
        }
    }, [dispatch, user]);

    const handleRemove = async (destinationId) => {
        try {
            await dispatch(removeFavorite(destinationId)).unwrap();
        } catch (err) {
            console.error("Impossible de retirer le favori :", err);
        }
    };

    if (!user) {
        return (
            <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <h2 className="fw-bold mb-3">Accès restreint</h2>
                <p className="text-muted mb-4">Vous devez être connecté pour voir vos voyages favoris.</p>
                <Button as={Link} to="/login" variant="primary" className="rounded-pill px-4 fw-bold">
                    Se connecter
                </Button>
            </Container>
        );
    }

    return (
        <section className="bg-light min-vh-100 py-5">
            <Container>
                <div className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
                    <div>
                        <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-1">
                            Votre sélection
                        </span>
                        <h1 className="display-5 fw-bold text-dark mb-0">Mes Favoris ❤️</h1>
                    </div>
                    <div className="text-muted fw-medium">
                        {favorites?.length || 0} {(favorites?.length || 0) > 1 ? 'destinations sauvées' : 'destination sauvée'}
                    </div>
                </div>

                {error && (
                    <Alert variant="danger" className="rounded-3 shadow-sm mb-4">
                        <Alert.Heading className="fs-6 fw-bold">Erreur de chargement</Alert.Heading>
                        <p className="mb-0 small">{error}</p>
                    </Alert>
                )}

                {status === 'pending' && (!favorites || favorites.length === 0) ? (
                    <div className="text-center py-5">
                        <Spinner animation="grow" variant="primary" />
                        <p className="mt-3 text-muted fw-medium">Chargement de vos coups de cœur...</p>
                    </div>
                ) : !favorites || favorites.length === 0 ? (
                    <Card className="border-0 shadow-sm rounded-4 text-center py-5">
                        <Card.Body className="py-5">
                            <div className="fs-1 mb-3 opacity-50">🧳</div>
                            <h3 className="fw-bold">Votre valise est vide !</h3>
                            <p className="text-muted mb-4 w-50 mx-auto">
                                Vous n'avez pas encore ajouté de destination à vos favoris. 
                                Explorez notre catalogue pour trouver la prochaine aventure de votre famille.
                            </p>
                            <Button as={Link} to="/destination" variant="primary" className="rounded-pill px-4 py-2 fw-bold shadow-sm">
                                Explorer les destinations
                            </Button>
                        </Card.Body>
                    </Card>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {favorites.map((fav) => (
                            <Col key={fav.destination_id || fav.destinationId}>
                                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                    <div className="position-relative" style={{ height: "200px" }}>
                                        <Card.Img 
                                            variant="top" 
                                            src={fav.destination_image || fav.image} 
                                            alt={fav.destination_title || fav.title}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                        <Button 
                                            variant="light" 
                                            className="position-absolute top-0 end-0 m-3 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm text-danger"
                                            style={{ width: "35px", height: "35px" }}
                                            onClick={() => handleRemove(fav.destination_id || fav.destinationId)}
                                            title="Retirer des favoris"
                                        >
                                            ❌
                                        </Button>
                                    </div>
                                    <Card.Body className="d-flex flex-column p-4">
                                        <Card.Title className="fw-bold fs-5 mb-3">
                                            {fav.destination_title || fav.title}
                                        </Card.Title>
                                        <Button 
                                            as={Link} 
                                            to={`/destination/${fav.destination_slug || fav.destination_id || fav.destinationId}`} 
                                            variant="outline-primary" 
                                            className="w-100 mt-auto rounded-pill fw-bold"
                                        >
                                            Voir les détails
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </section>
    );
}

export default FavoritesPage;