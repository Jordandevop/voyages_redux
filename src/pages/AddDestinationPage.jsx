import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/apiClient";

const destinationSchema = yup.object({
  name: yup.string().required("Le nom de la destination est requis."),
  slug: yup.string().required("Le slug est obligatoire pour l'URL."),
  region_id: yup.string().required("Veuillez sélectionner une région."),
  capital: yup.string().required("La capitale est requise."),
  description: yup.string().min(30, "La description doit faire au moins 30 caractères.").required("La description est requise."),
  image: yup.string().url("L'image doit être une URL valide.").required("L'URL de l'image est requise."),
  lat: yup.string().required("La latitude est requise (ex: 48.8566)."),
  long: yup.string().required("La longitude est requise (ex: 2.3522)."),
}).required();

function AddDestinationPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(destinationSchema),
    defaultValues: {
      name: "",
      slug: "",
      region_id: "",
      capital: "",
      description: "",
      image: "",
      lat: "",
      long: "",
    },
  });

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await apiRequest("/regions/index.php", { method: "GET" });
        setRegions(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadRegions();
  }, []);

  const watchName = watch("name");
  useEffect(() => {
    if (watchName) {
      const generatedSlug = watchName
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-z0-9]+/g, "-") 
        .replace(/(^-|-$)+/g, ""); 
      
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [watchName, setValue]);

  const onSubmit = async (data) => {
    setApiError(null);
    setApiSuccess(false);
    setIsLoading(true);

    try {
      if (user?.role !== "admin") {
        throw new Error("Action non autorisée. Rôle administrateur requis.");
      }

      await apiRequest("/destinations/store.php", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setApiSuccess(true);
      reset(); 
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      const errorMessage = err.message.toLowerCase();
      if (errorMessage.includes("slug") || errorMessage.includes("unique")) {
        setApiError("Ce slug est déjà utilisé. Veuillez en choisir un autre.");
      } else {
        setApiError(err.message || "Une erreur est survenue lors de l'ajout.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-light min-vh-100 py-5">
      <Container className="d-flex justify-content-center">
        <Card className="shadow-sm border-0 rounded-4 p-4" style={{ maxWidth: "800px", width: "100%" }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">🌍 Ajouter une destination</h2>
              <Button as={Link} to="/dashboard" variant="outline-secondary" size="sm" className="rounded-pill">
                Retour Dashboard
              </Button>
            </div>

            {apiSuccess && (
              <Alert variant="success" className="rounded-3 shadow-sm text-center fw-medium">
                ✨ La destination a été ajoutée avec succès au catalogue !
              </Alert>
            )}

            {apiError && (
              <Alert variant="danger" className="rounded-3 shadow-sm text-center fw-medium">
                ⚠️ {apiError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label className="fw-semibold text-secondary small">Nom de la destination</Form.Label>
                    <Form.Control type="text" placeholder="Ex: Costa Rica" isInvalid={!!errors.name} disabled={isLoading} {...register("name")} />
                    <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="slug">
                    <Form.Label className="fw-semibold text-secondary small">Slug de l'URL</Form.Label>
                    <Form.Control type="text" placeholder="ex: costa-rica" isInvalid={!!errors.slug} disabled={isLoading} {...register("slug")} />
                    <Form.Control.Feedback type="invalid">{errors.slug?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="region_id">
                    <Form.Label className="fw-semibold text-secondary small">Région du monde</Form.Label>
                    <Form.Select isInvalid={!!errors.region_id} disabled={isLoading} {...register("region_id")}>
                      <option value="">Sélectionner une région...</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.region_id?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="capital">
                    <Form.Label className="fw-semibold text-secondary small">Capitale</Form.Label>
                    <Form.Control type="text" placeholder="Ex: San José" isInvalid={!!errors.capital} disabled={isLoading} {...register("capital")} />
                    <Form.Control.Feedback type="invalid">{errors.capital?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="lat">
                    <Form.Label className="fw-semibold text-secondary small">Latitude</Form.Label>
                    <Form.Control type="text" placeholder="Ex: 9.9281" isInvalid={!!errors.lat} disabled={isLoading} {...register("lat")} />
                    <Form.Control.Feedback type="invalid">{errors.lat?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="long">
                    <Form.Label className="fw-semibold text-secondary small">Longitude</Form.Label>
                    <Form.Control type="text" placeholder="Ex: -84.0907" isInvalid={!!errors.long} disabled={isLoading} {...register("long")} />
                    <Form.Control.Feedback type="invalid">{errors.long?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="image">
                    <Form.Label className="fw-semibold text-secondary small">URL de l'image de couverture</Form.Label>
                    <Form.Control type="url" placeholder="https://votresite.com/images/costa-rica.jpg" isInvalid={!!errors.image} disabled={isLoading} {...register("image")} />
                    <Form.Control.Feedback type="invalid">{errors.image?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="description">
                    <Form.Label className="fw-semibold text-secondary small">Description détaillée</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Rédigez une description attractive..." isInvalid={!!errors.description} disabled={isLoading} {...register("description")} />
                    <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="primary" className="w-100 mt-4 rounded-pill fw-bold py-2.5" disabled={isLoading}>
                {isLoading ? (
                  <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />Création en cours...</>
                ) : "Ajouter la destination"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default AddDestinationPage;