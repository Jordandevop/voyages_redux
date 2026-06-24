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
    if (user?.id) dispatch(fetchFavorites(user.id));
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
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{ minHeight: "60vh", padding: "2rem" }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1.5rem", opacity: 0.4 }}>🔒</div>
        <h2 className="fw-bold mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
          Accès restreint
        </h2>
        <p className="mb-4" style={{ color: "var(--text-muted)" }}>
          Vous devez être connecté pour voir vos destinations favorites.
        </p>
        <Button as={Link} to="/login" className="btn-gold rounded-pill px-5 py-3 fw-bold">
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <>
    
      <div className="page-header">
        <Container style={{ position: "relative", zIndex: 2 }}>
          <span className="section-eyebrow">Votre sélection</span>
          <h1
            className="display-4 fw-bold mt-2 mb-1"
            style={{ fontFamily: "Playfair Display, serif", color: "#fff" }}
          >
            Mes Favoris
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: 0 }}>
            {favorites?.length || 0}{" "}
            {(favorites?.length || 0) > 1 ? "destinations sauvegardées" : "destination sauvegardée"}
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {error && (
          <Alert variant="danger" className="rounded-3 shadow-sm mb-4 border-0">
            {error}
          </Alert>
        )}

        {status === "pending" && (!favorites || favorites.length === 0) ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              style={{ color: "var(--gold)", width: "3rem", height: "3rem" }}
            />
            <p className="mt-3 fw-medium" style={{ color: "var(--text-muted)" }}>
              Chargement de vos coups de cœur…
            </p>
          </div>
        ) : !favorites || favorites.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", opacity: 0.3, marginBottom: "1.5rem" }}>🧳</div>
            <h3 className="fw-bold mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
              Votre valise est vide !
            </h3>
            <p
              className="mb-4 mx-auto"
              style={{ maxWidth: "420px", color: "var(--text-muted)", lineHeight: 1.7 }}
            >
              Vous n'avez pas encore sauvegardé de destination. Explorez notre catalogue
              pour trouver votre prochaine aventure.
            </p>
            <Button
              as={Link}
              to="/destination"
              className="btn-gold rounded-pill px-5 py-3 fw-bold shadow-sm"
            >
              Explorer les destinations
            </Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {favorites.map((fav) => (
              <Col key={fav.destination_id || fav.destinationId}>
                <Card className="luxury-card h-100">
                  <div className="destination-card-image-wrap">
                    <img
                      src={fav.destination_image || fav.image}
                      alt={fav.destination_title || fav.title}
                    />
                   
                    <button
                      className="position-absolute top-0 end-0 m-3 border-0 d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.92)",
                        cursor: "pointer",
                        zIndex: 10,
                        fontSize: "0.9rem",
                        transition: "var(--transition)",
                      }}
                      onClick={() => handleRemove(fav.destination_id || fav.destinationId)}
                      title="Retirer des favoris"
                    >
                      ✕
                    </button>
                  </div>
                  <Card.Body className="d-flex flex-column p-4">
                    <h5
                      className="fw-bold mb-3"
                      style={{ fontFamily: "Playfair Display, serif", fontSize: "1.15rem" }}
                    >
                      {fav.destination_title || fav.title}
                    </h5>
                    <Button
                      as={Link}
                      to={`/destination/${fav.destination_slug || fav.destination_id || fav.destinationId}`}
                      className="w-100 mt-auto rounded-pill fw-bold"
                      style={{
                        background: "var(--navy)",
                        border: "none",
                        color: "#fff",
                        fontSize: "0.85rem",
                        letterSpacing: "0.04em",
                        padding: "0.65rem 1rem",
                      }}
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
    </>
  );
}

export default FavoritesPage;
