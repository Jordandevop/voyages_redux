import { Container, Card, Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

function ProfilePage() {
  const navigate = useNavigate();
  

  const { user, logout, isAuthenticated } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4">
            <Card.Body className="text-center">
              
              <div className="mb-4">
                <Image 
                  src={user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  roundedCircle 
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  className="shadow-sm border"
                  alt="Avatar utilisateur"
                />
              </div>

              <h3 className="fw-bold text-dark mb-1">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-primary fw-medium small mb-4">@{user.username}</p>

              <hr className="opacity-25 my-3" />

              <div className="text-start px-3 mb-4">
                <div className="mb-3">
                  <small className="text-muted d-block fw-semibold">Adresse Email</small>
                  <span className="text-secondary">{user.email}</span>
                </div>
                <div>
                  <small className="text-muted d-block fw-semibold">Genre</small>
                  <span className="text-secondary text-capitalize">
                    {user.gender === "male" ? "Homme" : user.gender === "female" ? "Femme" : "Non défini"}
                  </span>
                </div>
              </div>

              <Button
                variant="outline-danger"
                className="w-100 rounded-pill fw-bold py-2"
                onClick={handleLogout} 
              >
                Déconnexion
              </Button>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;