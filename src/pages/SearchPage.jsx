import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Badge, Alert, Form, Container, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { searchDestinations, clearSearchResults } from "../features/search/searchSlice";
import { apiRequest } from "../api/apiClient";

const searchSchema = yup.object({
  keyword: yup
    .string()
    .transform((v) => (v === "" ? undefined : v))
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
    reset,
  } = useForm({
    resolver: yupResolver(searchSchema),
    defaultValues: { keyword: currentSearch, region: currentRegion },
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

  const showResults = currentSearch || currentRegion || status === "success";

  return (
    <>

      <div className="page-header">
        <Container style={{ position: "relative", zIndex: 2 }}>
          <span className="section-eyebrow">Explorez notre catalogue</span>
          <h1
            className="display-4 fw-bold mt-2 mb-3"
            style={{ fontFamily: "Playfair Display, serif", color: "#fff" }}
          >
            Trouver votre voyage
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", maxWidth: "480px", lineHeight: 1.75, marginBottom: 0 }}>
            Utilisez nos filtres pour trouver la destination qui correspond
            à vos envies et à votre budget.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        <Card
          className="border-0 mb-5 shadow-sm"
          style={{ borderRadius: "1rem", background: "#fff" }}
        >
          <Card.Body className="p-4 luxury-form">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-3 align-items-end">
                <Col lg={4} md={6}>
                  <Form.Group controlId="searchKeyword">
                    <Form.Label className="form-label">Destination, capitale…</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ex : Japon, Paris, Plage…"
                      className="rounded-pill px-4"
                      isInvalid={!!errors.keyword}
                      {...register("keyword")}
                    />
                    <Form.Control.Feedback type="invalid" className="fw-semibold px-3">
                      {errors.keyword?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg={3} md={6}>
                  <Form.Group controlId="searchRegion">
                    <Form.Label className="form-label">Région / Continent</Form.Label>
                    <Form.Select className="rounded-pill px-4" {...register("region")}>
                      <option value="">Toutes les régions</option>
                      {regionsList.map((reg) => (
                        <option key={reg.id} value={reg.slug}>
                          {reg.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col lg={3} md={6} className="d-flex gap-2">
                  <Button
                    type="submit"
                    className="btn-gold rounded-pill fw-bold w-100 py-2"
                    style={{ letterSpacing: "0.04em", fontSize: "0.875rem" }}
                    disabled={status === "pending"}
                  >
                    {status === "pending" ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Rechercher"
                    )}
                  </Button>
                  {showResults && (
                    <Button
                      variant="outline-secondary"
                      className="rounded-pill flex-shrink-0 px-3"
                      onClick={handleReset}
                      title="Réinitialiser"
                    >
                      ✕
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" className="rounded-4 border-0 shadow-sm mb-4">
            Une erreur est survenue : {error}
          </Alert>
        )}

        {showResults && !error && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2
                className="h4 mb-0 fw-bold"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Résultats
              </h2>
              <span
                className="rounded-pill px-3 py-1 fw-semibold"
                style={{
                  background: "var(--gold-subtle)",
                  color: "var(--gold-dark)",
                  fontSize: "0.82rem",
                  border: "1px solid var(--gold-light)",
                }}
              >
                {results.length} trouvé{results.length > 1 ? "s" : ""}
              </span>
            </div>

            {status === "pending" ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  style={{ color: "var(--gold)", width: "3rem", height: "3rem" }}
                />
              </div>
            ) : results.length > 0 ? (
              <Row xs={1} md={2} lg={3} className="g-4">
                {results.map((destination) => (
                  <Col key={destination.id}>
                    <Card
                      className="luxury-card h-100"
                      onClick={() => navigate(`/destination/${destination.slug}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="destination-card-image-wrap">
                        <img src={destination.image} alt={destination.name} />
                        {(destination.region_name || destination.region) && (
                          <Badge
                            className="position-absolute bottom-0 start-0 m-3 rounded-pill text-white"
                            style={{
                              background: "rgba(13,27,42,0.72)",
                              backdropFilter: "blur(6px)",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              padding: "0.4rem 0.85rem",
                            }}
                          >
                            {destination.region_name || destination.region}
                          </Badge>
                        )}
                      </div>
                      <Card.Body className="d-flex flex-column p-4">
                        <h5
                          className="fw-bold mb-1"
                          style={{ fontFamily: "Playfair Display, serif", fontSize: "1.2rem" }}
                        >
                          {destination.name}
                        </h5>
                        <p
                          className="mb-3"
                          style={{ fontSize: "0.78rem", color: "var(--gold)", fontWeight: 600, letterSpacing: "0.04em" }}
                        >
                          ◈ {destination.capital}
                        </p>
                        <p
                          className="flex-grow-1 mb-4"
                          style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65 }}
                        >
                          {destination.description?.length > 100
                            ? `${destination.description.substring(0, 100)}…`
                            : destination.description}
                        </p>
                        <div
                          className="w-100 text-center rounded-pill fw-bold py-2"
                          style={{
                            background: "var(--navy)",
                            color: "#fff",
                            fontSize: "0.85rem",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Découvrir
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-5">
                <div style={{ fontSize: "3.5rem", opacity: 0.3, marginBottom: "1.5rem" }}>🗺️</div>
                <h4 className="fw-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  Aucun résultat
                </h4>
                <p style={{ color: "var(--text-muted)" }}>
                  Essayez de modifier vos filtres pour trouver votre destination idéale.
                </p>
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
}

export default SearchPage;
