import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Badge, Alert, Form, Container, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { searchDestinations, clearSearchResults } from "../features/search/searchSlice";
import { apiRequest } from "../api/apiClient";
import getRegionColor from "../utils/helper";

const searchSchema = yup.object({
    keyword: yup.string()
        .transform((value) => (value === "" ? undefined : value))
        .min(2, "La recherche doit avoir au moins 2 caractères."),
    region: yup.string(),
});

function SearchPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { results, status, error } = useSelector((state) => state.search);
    const [regionsList, setRegionsList] = useState([]);

    const currentSearch = searchParams.get("keyword") || "";
    const currentRegion = searchParams.get("region") || "";

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
        }
    });

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const data = await apiRequest("/regions/index.php", { method: "GET" });
                setRegionsList(data || []);
            } catch (err) {
                console.error("Erreur régions :", err);
            }
        };
        fetchRegions();
    }, []);

    useEffect(() => {
        if (currentSearch || currentRegion) {
            dispatch(searchDestinations({ keyword: currentSearch, region: currentRegion }));
        } else {
            dispatch(clearSearchResults());
        }
    }, [currentSearch, currentRegion, dispatch]);

    const onSubmit = (data) => {
        const params = new URLSearchParams();
        if (data.keyword) params.append("keyword", data.keyword);
        if (data.region) params.append("region", data.region);
        
        navigate(`/search?${params.toString()}`);
    };

    const handleReset = () => {
        reset({ keyword: "", region: "" });
        dispatch(clearSearchResults());
        navigate("/search");
    };

    const showResults = currentSearch || currentRegion || status === 'success';

    return (
        <Container className="py-5">
            <h1 className="display-5 fw-bold text-dark mb-4">Trouver votre prochain voyage</h1>

            <Card className="shadow-sm border-0 mb-5 rounded-4 bg-white">
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="g-3 align-items-end">

                            <Col lg={4} md={6}>
                                <Form.Group controlId="searchKeyword">
                                    <Form.Label className="fw-semibold text-secondary">Destination, capitale...</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Japon, Paris, Plage..."
                                        className="py-2.5 rounded-pill px-4"
                                        isInvalid={!!errors.keyword}
                                        {...register("keyword")}
                                    />
                                    <Form.Control.Feedback type="invalid" className="fw-bold px-3">
                                        {errors.keyword?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col lg={3} md={6}>
                                <Form.Group controlId="searchRegion">
                                    <Form.Label className="fw-semibold text-secondary">Région / Continent</Form.Label>
                                    <Form.Select className="py-2.5 rounded-pill px-4" {...register("region")}>
                                        <option value="">Toutes les régions</option>
                                        {regionsList.map((reg) => (
                                            <option key={reg.id} value={reg.slug}>{reg.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            
                            <Col lg={2} md={6} className="d-flex gap-2">
                                <Button type="submit" variant="primary" className="w-100 fw-bold py-2.5 rounded-pill" disabled={status === 'pending'}>
                                    {status === 'pending' ? <Spinner size="sm" animation="border" /> : "Rechercher"}
                                </Button>
                                { showResults && (
                                    <Button variant="outline-danger" className="rounded-pill" onClick={handleReset} title="Réinitialiser">
                                        &times;
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {error && (
                <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
                    ⚠️ Une erreur est survenue lors de la recherche : {error}
                </Alert>
            )}

            {showResults && !error && (
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h4 mb-0 text-dark">
                            Résultats de la recherche
                        </h2>
                        <Badge bg="secondary" className="px-3 py-2 rounded-pill">
                            {results.length} trouvé{results.length > 1 ? "s" : ""}
                        </Badge>
                    </div>

                    {status === 'pending' ? (
                        <div className="text-center py-5">
                            <Spinner animation="grow" variant="primary" />
                        </div>
                    ) : results.length > 0 ? (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {results.map((destination) => (
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
                                                <Badge bg={getRegionColor(destination.region_name || destination.region)} className="rounded-pill px-3 py-2 text-white">
                                                    {destination.region_name || destination.region}
                                                </Badge>
                                            </div>
                                            <p className="text-muted small mb-2">📍 Capitale : {destination.capital}</p>
                                            
                                            <Card.Text className="text-secondary flex-grow-1">
                                                {destination.description?.length > 90 
                                                    ? `${destination.description.substring(0, 90)}...` 
                                                    : destination.description}
                                            </Card.Text>

                                            <Button variant="outline-primary" className="w-100 mt-3 rounded-pill fw-bold pointer-events-none">
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
                            <p className="text-muted mb-0">Essayez de modifier vos filtres pour trouver votre destination idéale.</p>
                        </Alert>
                    )}
                </div>
            )}
        </Container>
    );
}

export default SearchPage;