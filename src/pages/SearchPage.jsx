import { Button, Card, Col, Row, Badge, Alert, Form, Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { destinations } from "../data/destinations";
import getRegionColor from "../utils/helper";

const searchSchema = yup.object({
    keyword: yup.string()
        .transform((value) => (value === "" ? undefined : value))
        .min(2, "La recherche doit avoir au moins 2 caractères."),
    region: yup.string(),
    budget: yup.string() 
});

function SearchPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const currentSearch = searchParams.get("q") || "";
    const currentRegion = searchParams.get("region") || "";
    const currentBudget = searchParams.get("budget") || "";

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(searchSchema),
        defaultValues: {
            keyword: currentSearch,
            region: currentRegion,
            budget: currentBudget
        }
    });

    const filteredDestinations = destinations.filter((destination) => {
        const search = currentSearch.toLowerCase();
        const selectedRegion = currentRegion.toLowerCase();
        const selectedBudget = currentBudget.toLowerCase();

        const matchKeyword = !search || 
            destination.name.toLowerCase().includes(search) ||
            destination.capital.toLowerCase().includes(search) ||
            destination.region.toLowerCase().includes(search) ||
            destination.language.toLowerCase().includes(search) ||
            destination.currency.toLowerCase().includes(search);

        const matchRegion = !selectedRegion || destination.region.toLowerCase().includes(selectedRegion);

        const matchBudget = !selectedBudget || destination.budget.toLowerCase().includes(selectedBudget);
        
        return matchKeyword && matchRegion && matchBudget;
    });

    const onSubmit = (data) => {
        const params = new URLSearchParams();
        if (data.keyword) params.append("q", data.keyword);
        if (data.region) params.append("region", data.region);
        if (data.budget) params.append("budget", data.budget); 
        
        navigate(`/search?${params.toString()}`);
    };

    const handleReset = () => {
        reset({ keyword: "", region: "", budget: "" });
        navigate("/search");
    };

    return (
        <Container className="py-5">
            <h1 className="display-5 fw-bold text-dark mb-4">Trouver votre prochain voyage</h1>

            <Card className="shadow-sm border-0 mb-5 rounded-4">
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="g-3 align-items-end">

                            <Col lg={4} md={6}>
                                <Form.Group controlId="searchKeyword">
                                    <Form.Label className="fw-semibold text-secondary">Destination, langue, monnaie...</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Japon, Espagnol, Yen, Rome..."
                                        className="py-2.5"
                                        isInvalid={!!errors.keyword}
                                        {...register("keyword")}
                                    />
                                    <Form.Control.Feedback type="invalid" className="fw-bold">
                                        {errors.keyword?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col lg={3} md={6}>
                                <Form.Group controlId="searchRegion">
                                    <Form.Label className="fw-semibold text-secondary">Région / Continent</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="Ex: Europe, Asie..."
                                        className="py-2.5"
                                        {...register("region")}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg={3} md={6}>
                                <Form.Group controlId="searchBudget">
                                    <Form.Label className="fw-semibold text-secondary">Gamme de budget</Form.Label>
                                    <Form.Select className="py-2.5" {...register("budget")}>
                                        <option value="">Tous les budgets</option>
                                        <option value="faible">Faible (Idéal petits budgets)</option>
                                        <option value="moyen">Moyen (Standard)</option>
                                        <option value="élevé">Élevé / Très élevé (Haut de gamme)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            
                            <Col lg={2} md={6} className="d-flex gap-2">
                                <Button type="submit" variant="primary" className="w-100 fw-bold py-2.5">
                                    Rechercher
                                </Button>
                                { (currentSearch || currentRegion || currentBudget) && (
                                    <Button variant="outline-danger" onClick={handleReset} title="Réinitialiser tous les filtres">
                                        &times;
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {(currentSearch || currentRegion || currentBudget) && (
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h4 mb-0 text-dark">
                            Résultats de votre recherche
                        </h2>
                        <Badge bg="secondary" className="px-3 py-2 rounded-pill">
                            {filteredDestinations.length} trouvé{filteredDestinations.length > 1 ? "s" : ""}
                        </Badge>
                    </div>

                    {filteredDestinations.length > 0 ? (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {filteredDestinations.map((destination) => (
                                <Col key={destination.id}>
                                    <Card 
                                        onClick={() => navigate(`/destination/${destination.slug}`)} 
                                        style={{ cursor: "pointer" }} 
                                        className="h-100 border-0 shadow-sm rounded-4 overflow-hidden destination-card"
                                    >
                                        <div style={{ height: "200px", overflow: "hidden" }}>
                                            <Card.Img 
                                                variant="top" 
                                                src={destination.image} 
                                                alt={destination.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <Card.Title className="fw-bold mb-0 fs-4">{destination.name}</Card.Title>
                                                <Badge bg={getRegionColor(destination.region)} className="rounded-pill px-3 py-2 text-white">
                                                    {destination.region}
                                                </Badge>
                                            </div>
                                            <p className="text-muted small mb-2">📍 Capitale : {destination.capital}</p>
                                            
                                            <Card.Text className="text-secondary flex-grow-1">
                                                {destination.description.length > 90 
                                                    ? `${destination.description.substring(0, 90)}...` 
                                                    : destination.description}
                                            </Card.Text>

                                            <hr className="text-muted opacity-25 my-3" />
                                            <div className="d-flex flex-column gap-1 small text-muted mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <span>💰 {destination.budget.split(',')[0]}</span>
                                                    <span>🗣️ {destination.language.split(' ')[0]}</span>
                                                </div>
                                                <div className="text-truncate text-start mt-1 text-primary fw-medium" style={{ fontSize: '0.8rem' }}>
                                                    📅 Idéal : {destination.bestSeason.split(' pour ')[0]}
                                                </div>
                                            </div>

                                            <Button variant="outline-primary" className="w-100 mt-auto rounded-pill fw-bold pointer-events-none">
                                                Découvrir {destination.name}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Alert variant="warning" className="border-0 shadow-sm rounded-4 py-5 text-center mt-4">
                            <div className="display-4 mb-3">🗺️</div>
                            <h4 className="fw-bold">Aucun voyage ne correspond à vos critères</h4>
                            <p className="text-muted mb-0">Essayez de modifier vos filtres ou d'élargir votre budget.</p>
                        </Alert>
                    )}
                </div>
            )}
        </Container>
    );
}

export default SearchPage;