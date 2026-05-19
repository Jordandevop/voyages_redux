import { Container, Card, Row, Col, Button, Image, Badge, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function ProfilePage() {
  const { user, token, logout } = useAuth();
  const [fullProfile, setFullProfile] = useState(null);


  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('https://dummyjson.com/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error("Erreur de sécurité : Impossible de récupérer vos données.");
        }

        const data = await response.json();
        setFullProfile(data);
      } catch (error) {
       
      } 
    };

    fetchUserProfile();
  }, [token]); 

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={7}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Body className="p-4 pt-0">
              <Row className="align-items-end mb-4">
                <Col xs="auto">
                  <Image
                    src={fullProfile?.image}
                    roundedCircle
                    className="border border-4 border-white shadow"
                    style={{
                      marginTop: '10px',
                      width: "130px",
                      height: "130px",
                      backgroundColor: "white",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col>
                  <div className="mb-2">
                    <h2 className="fw-bold d-inline-block me-2 mb-0">
                      {fullProfile?.firstName} {fullProfile?.lastName}
                    </h2>
                    <Badge
                      bg={fullProfile?.role === "admin" ? "danger" : "success"}
                      className="rounded-pill px-3 py-2 align-middle shadow-sm"
                      style={{
                        fontSize: "0.7rem",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {fullProfile?.role}
                    </Badge>
                  </div>
                  <p className="text-muted mb-0">@{fullProfile?.username}</p>
                </Col>
                <Col xs="auto" className="d-none d-md-block">
                  <Button
                    variant="outline-danger"
                    className="rounded-pill fw-bold"
                    onClick={logout}
                  >
                    Déconnexion
                  </Button>
                </Col>
              </Row>

              <Row className="g-4">
                <Col md={6}>
                  <div className="p-3 rounded-4 bg-light h-100 border border-light">
                    <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                      📍 Coordonnées
                    </h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">Email</small>
                      <span className="fw-semibold">{fullProfile?.email}</span>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Téléphone</small>
                      <span className="fw-semibold">{fullProfile?.phone}</span>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="p-3 rounded-4 bg-light h-100 border border-light">
                    <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">
                      👤 Informations
                    </h6>
                    <div className="mb-2">
                      <small className="text-muted d-block">
                        Âge / Anniversaire
                      </small>
                      <span className="fw-semibold">
                        {fullProfile?.age} ans ({fullProfile?.birthDate})
                      </span>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Ville</small>
                      <span className="fw-semibold">
                        {fullProfile?.address?.city}, {fullProfile?.address?.stateCode}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="d-grid d-md-none mt-4">
                <Button
                  variant="danger"
                  className="rounded-pill fw-bold py-2"
                  onClick={logout}
                >
                  Déconnexion
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;