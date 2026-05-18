import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <Container 
            className="d-flex flex-column align-items-center justify-content-center text-center py-5" 
            style={{ minHeight: "70vh" }}
        >
        
            <div className="mb-4" style={{ fontSize: "6rem" }}>
                🧭
            </div>

            <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
            
           
            <h2 className="h3 mb-3 text-dark">Oups ! Vous semblez vous être égaré...</h2>
            <p className="text-muted fs-5 mb-5" style={{ maxWidth: "600px" }}>
                La destination que vous cherchez n'existe pas sur notre carte ou a été déplacée. 
                Mais ne vous inquiétez pas, de nombreuses autres aventures vous attendent !
            </p>

            
            <Button as={Link} to="/" variant="primary" size="lg" className="rounded-pill px-5 shadow-sm fw-bold">
                Retour à l'accueil
            </Button>
        </Container>
    );
}

export default NotFoundPage;