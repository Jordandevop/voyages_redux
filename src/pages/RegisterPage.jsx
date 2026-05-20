import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUSer } from "../features/auth/authSlice";
import { useState } from "react";

const registerSchema = yup.object({
  username: yup
    .string()
    .required("Le nom d'utilisateur est requis.")
    .min(4, "Le nom d'utilisateur doit faire au moins 4 caractères."),

  email: yup
    .string()
    .required("L'adresse email est requise.")
    .email("Veuillez saisir un email valide."),

  password: yup
    .string()
    .required("Le mot de passe est requis.")
    .min(8, "Le mot de passe doit faire au moins 8 caractères.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).",
    ),

  firstName: yup.string().required("Le prénom est requis."),

  lastName: yup.string().required("Le nom de famille est requis."),

  gender: yup.string().notRequired(),

  avatar: yup
    .string()
    .url("L'avatar doit être une URL valide (ex: https://...)")
    .notRequired(),
});

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
      avatar: "",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUSer(data)).unwrap();

      navigate("/login");
    } catch (err) {
      console.error("Erreur d'inscription :", err);
    }
  };

const getErrorMessage = () => {
    if (!error) return null;
    const lowerError = error.toLowerCase();

    if (lowerError.includes("username") || lowerError.includes("pseudo")) {
      return "Ce pseudo est déjà utilisé. Veuillez en choisir un autre.";
    }
    
    if (lowerError.includes("email") || lowerError.includes("mail")) {
      return "Cette adresse email est déjà utilisée. Veuillez vous connecter ou en choisir une autre.";
    }
    
    if (lowerError.includes("duplicate") || lowerError.includes("déjà")) {
      return "Ces identifiants (email ou pseudo) sont déjà utilisés.";
    }
    return error; 
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className="shadow-sm border-0 rounded-4 p-4"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <Card.Body>
          <h2 className="fw-bold text-center mb-4">Créer un compte</h2>
          {error && (
            <Alert variant="danger" className="text-center rounded-3 shadow-sm">
              <span className="fw-medium">{getErrorMessage()}</span>
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="g-3 align-items-end">
              <Col md={12}>
                <Form.Group controlId="username">
                  <Form.Label className="fw-semibold text-secondary">
                    Nom utilisateur
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: travel_master"
                    className="py-2.5"
                    isInvalid={!!errors.username}
                    {...register("username")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.username?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="email">
                  <Form.Label className="fw-semibold text-secondary">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ex: travel_master@outlok.com"
                    className="py-2.5"
                    isInvalid={!!errors.email}
                    {...register("email")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="password">
                  <Form.Label className="fw-semibold text-secondary">
                    Mot de passe
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Ex: 123password/"
                      className="py-2.5 password-input"
                      isInvalid={!!errors.password}
                      {...register("password")}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted password-icon"
                    >
                      {showPassword ? "🙉" : "🙈"}
                    </span>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block fw-bold mt-1">
                      {errors.password.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label className="fw-semibold text-secondary">
                    Prénom
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: John"
                    className="py-2.5"
                    isInvalid={!!errors.firstName}
                    {...register("firstName")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label className="fw-semibold text-secondary">
                    Nom
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Doe"
                    className="py-2.5"
                    isInvalid={!!errors.lastName}
                    {...register("lastName")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="gender">
                  <Form.Label className="fw-semibold text-secondary">
                    Genre
                  </Form.Label>
                  <Form.Select className="py-2.5" {...register("gender")}>
                    <option value="">Genre</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="none">Non défini</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.gender?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="avatar">
                  <Form.Label className="fw-semibold text-secondary">
                    Avatar
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Ex: https://...."
                    className="py-2.5"
                    isInvalid={!!errors.avatar}
                    {...register("avatar")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-bold">
                    {errors.avatar?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              variant="primary"
              className="w-100 mt-4 rounded-pill fw-bold py-2"
              disabled={status === "pending"}
            >
              {status === "pending" ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Création en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </Form>

          <div className="text-center mt-3 small text-muted">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-decoration-none">
              Connectez-vous
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;
