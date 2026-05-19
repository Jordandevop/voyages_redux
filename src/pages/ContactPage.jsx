import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


const contactSchema = yup.object({
    name: yup.string()
        .trim()
        .required("Veuillez saisir votre nom et prénom.")
        .min(3, "Votre nom doit contenir au moins 3 caractères."),
    email: yup.string()
        .trim()
        .email("Veuillez saisir une adresse email valide.")
        .required("L'adresse email est obligatoire."),
    subject: yup.string()
        .trim()
        .required("Veuillez préciser l'objet de votre message.")
        .min(5, "L'objet doit faire au moins 5 caractères."),
    message: yup.string()
        .trim()
        .required("Le message ne peut pas être vide.")
        .min(10, "Votre message doit faire au moins 10 caractères pour être traité.")
}).required();

function ContactPage() {
    // États pour simuler l'envoi de données
    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

   
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: ""
        }
    });

    const onSubmit = (data) => {
        setIsSending(true);
        setShowSuccess(false);

        // Simulation
        setTimeout(() => {
            setIsSending(false);
            setShowSuccess(true);
            console.log("Données du formulaire envoyées :", data);
            reset(); 
        }, 2000);
    };

    return (
        <section className="bg-light min-vh-100 py-5">
            <Container>
                <Row className="g-5 align-items-stretch">
                    <Col lg={5} className="d-flex flex-column justify-content-center">
                        <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">
                            Une question ? Un projet ?
                        </span>
                        <h1 className="display-4 fw-bold text-dark mb-4">Contactez-nous</h1>
                        <p className="text-secondary fs-5 mb-4">
                            Nos experts en voyage sont à votre disposition pour vous aider à planifier 
                            l'itinéraire de vos rêves ou répondre à vos questions pratiques. 
                        </p>
                        
                        <hr className="my-4 opacity-25" />
                        
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white shadow-sm p-3 rounded-circle fs-4">📍</div>
                                <div>
                                    <h6 className="fw-bold mb-0">Notre agence</h6>
                                    <small className="text-muted">12 Avenue des Horizons, 75001 Paris</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white shadow-sm p-3 rounded-circle fs-4">📞</div>
                                <div>
                                    <h6 className="fw-bold mb-0">Téléphone</h6>
                                    <small className="text-muted">+33 (0)1 23 45 67 89</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-white shadow-sm p-3 rounded-circle fs-4">✉️</div>
                                <div>
                                    <h6 className="fw-bold mb-0">Email</h6>
                                    <small className="text-muted">contact@evasion-voyages.fr</small>
                                </div>
                            </div>
                        </div>
                    </Col>

                   
                    <Col lg={7}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white">
                            <Card.Body>
                                <h3 className="fw-bold text-dark mb-4">Envoyer un message</h3>
                                
                                {showSuccess && (
                                    <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible className="rounded-3 border-0 shadow-sm">
                                        <Alert.Heading className="fs-5 fw-bold">✨ Message envoyé avec succès !</Alert.Heading>
                                        <p className="mb-0 small">
                                            Merci pour votre démarche. Notre équipe étudie votre demande et vous recontactera sous 24h à 48h.
                                        </p>
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row className="g-3">
                                        
                                        <Col md={6}>
                                            <Form.Group controlId="contactName">
                                                <Form.Label className="small fw-semibold text-muted">Nom & Prénom</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="John Doe" 
                                                    isInvalid={!!errors.name}
                                                    disabled={isSending}
                                                    {...register("name")}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.name?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Email */}
                                        <Col md={6}>
                                            <Form.Group controlId="contactEmail">
                                                <Form.Label className="small fw-semibold text-muted">Adresse Email</Form.Label>
                                                <Form.Control 
                                                    type="email" 
                                                    placeholder="john.doe@example.com" 
                                                    isInvalid={!!errors.email}
                                                    disabled={isSending}
                                                    {...register("email")}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Objet */}
                                        <Col md={12}>
                                            <Form.Group controlId="contactSubject">
                                                <Form.Label className="small fw-semibold text-muted">Objet du message</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Ex: Demande de devis pour le Japon" 
                                                    isInvalid={!!errors.subject}
                                                    disabled={isSending}
                                                    {...register("subject")}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.subject?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Message */}
                                        <Col md={12}>
                                            <Form.Group controlId="contactMessage">
                                                <Form.Label className="small fw-semibold text-muted">Votre message</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows={5} 
                                                    placeholder="Racontez-nous votre projet de voyage en quelques lignes..." 
                                                    isInvalid={!!errors.message}
                                                    disabled={isSending}
                                                    {...register("message")}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.message?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        {/* Bouton de soumission avec Spinner dynamique */}
                                        <Col md={12} className="mt-4">
                                            <Button 
                                                type="submit" 
                                                variant="primary" 
                                                size="lg" 
                                                className="w-100 rounded-pill fw-bold py-2.5 shadow-sm"
                                                disabled={isSending}
                                            >
                                                {isSending ? (
                                                    <>
                                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                        Envoi en cours...
                                                    </>
                                                ) : (
                                                    "Envoyer la demande"
                                                )}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default ContactPage;