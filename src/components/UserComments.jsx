import { useState, useEffect } from "react";
import { Card, Spinner, Alert, Carousel, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useSelector } from "react-redux";

export default function UserComments() {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // On récupère le thème pour adapter les flèches du carousel
    const { mode } = useSelector((state) => state.theme);

    useEffect(() => {
        const fetchUserComments = async () => {
            try {
                const data = await apiRequest("/comments/by-user.php", { method: "GET" });
                setComments(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserComments();
    }, []);

    const renderStars = (rating) => {
        return "⭐".repeat(rating) + "☆".repeat(5 - rating);
    };

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Récupération de vos souvenirs...</p>
            </div>
        );
    }

    if (error) return <Alert variant="danger" className="mt-4">⚠️ {error}</Alert>;

    if (comments.length === 0) {
        return (
            <Card className="border-0 shadow-sm rounded-4 text-center p-5 mt-5 bg-light">
                <div className="fs-1 mb-2">✍️</div>
                <h5 className="fw-bold">Aucun avis pour le moment</h5>
                <p className="text-muted mb-0">Partagez vos expériences sur les pages de destinations pour les retrouver ici !</p>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm rounded-4 mt-5 mb-3 overflow-hidden">
            <Card.Header className="bg-primary text-white border-0 py-3 px-4">
                <h4 className="fw-bold mb-0">💬 Mon Journal de Voyage</h4>
            </Card.Header>
            <Card.Body className="p-0">
                <Carousel 
                    variant={mode === "light" ? "dark" : "light"} 
                    className="py-5"
                    indicators={comments.length > 1}
                    controls={comments.length > 1}
                >
                    {comments.map((comment) => (
                        <Carousel.Item key={comment.id}>
                            <div className="text-center px-5 mx-lg-5">
                                <Badge bg="light" text="dark" className="border mb-3 fs-6 rounded-pill px-3 py-2">
                                    {renderStars(comment.rating || 5)}
                                </Badge>
                                
                                <h3 className="fw-bold mb-3 text-truncate px-3">
                                    {comment.destination_name || "Destination Mystère"}
                                </h3>
                                
                                <p className="fs-5 fst-italic text-secondary mb-4 mx-auto" style={{ maxWidth: "600px", minHeight: "80px" }}>
                                    "{comment.content}"
                                </p>

                                <div className="mb-4">
                                    <Button 
                                        as={Link} 
                                        to={`/destination/${comment.destination_slug || comment.destination_id}`} 
                                        variant="primary" 
                                        className="rounded-pill px-4 fw-bold shadow-sm"
                                    >
                                        Revoir la destination
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Card.Body>
        </Card>
    );
}