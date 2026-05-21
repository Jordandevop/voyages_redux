import { Container, Row, Col, Button, Image, Badge, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { apiRequest } from "../api/apiClient";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { token } = useSelector((state) => state.auth);
  const [fullProfile, setFullProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const data = await apiRequest('/auth/me.php', { method: 'GET' });
        setFullProfile(data);
      } catch (error) {
        console.error("Impossible de charger le profil :", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  if (isLoading) {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>

      <div className="d-flex flex-column align-items-center mb-5 text-center">
        <Image
          src={fullProfile?.image || "https://via.placeholder.com/150"}
          roundedCircle
          className="mb-3 shadow-sm border"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <h2 className="fw-bold mb-1">
          {fullProfile?.firstName} {fullProfile?.lastName}
        </h2>
        <p className="text-muted mb-3">@{fullProfile?.username}</p>
        <Badge bg={fullProfile?.role === "admin" ? "dark" : "light"} text={fullProfile?.role === "admin" ? "light" : "dark"} className="px-3 py-2 rounded-pill border">
          {fullProfile?.role || "Membre"}
        </Badge>
      </div>

      <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
        <h5 className="fw-bold mb-4">Informations du compte</h5>

        <Row className="mb-3 align-items-center">
          <Col xs={5} sm={4} className="text-muted fw-medium">Email</Col>
          <Col xs={7} sm={8} className="text-end text-sm-start text-break fw-semibold">
            {fullProfile?.email}
          </Col>
        </Row>
        
        <hr className="text-muted opacity-25 my-3" />

        <Row className="mb-3 align-items-center">
          <Col xs={5} sm={4} className="text-muted fw-medium">Téléphone</Col>
          <Col xs={7} sm={8} className="text-end text-sm-start fw-semibold">
            {fullProfile?.phone || "Non renseigné"}
          </Col>
        </Row>

      </div>
      <Button 
        variant="outline-danger" 
        className="w-100 rounded-pill py-2 fw-bold" 
        onClick={handleLogout}
      >
        Se déconnecter
      </Button>

    </Container>
  );
}

export default ProfilePage;