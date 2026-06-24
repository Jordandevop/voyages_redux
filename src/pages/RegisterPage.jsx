import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useState } from "react";

const registerSchema = yup.object({
  username: yup
    .string()
    .required("Le nom d'utilisateur est requis.")
    .min(4, "Minimum 4 caractères."),
  email: yup
    .string()
    .required("L'adresse email est requise.")
    .email("Email invalide."),
  password: yup
    .string()
    .required("Le mot de passe est requis.")
    .min(8, "Minimum 8 caractères.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Doit contenir majuscule, minuscule, chiffre et caractère spécial (@$!%*?&).",
    ),
  firstName: yup.string().required("Le prénom est requis."),
  lastName: yup.string().required("Le nom est requis."),
  gender: yup.string().notRequired(),
  avatar: yup.string().url("Doit être une URL valide.").notRequired(),
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
      await dispatch(registerUser(data)).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Erreur d'inscription :", err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    const low = error.toLowerCase();
    if (low.includes("username") || low.includes("pseudo"))
      return "Ce pseudo est déjà utilisé.";
    if (low.includes("email") || low.includes("mail"))
      return "Cette adresse email est déjà utilisée.";
    if (low.includes("duplicate") || low.includes("déjà"))
      return "Ces identifiants sont déjà utilisés.";
    return error;
  };

  return (
    <div className="auth-split">
      <div
        className="auth-image-panel d-none d-lg-block"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/04/25/18/55/cruise-5092182_1280.jpg')",
        }}
      >
        <div className="auth-panel-content">
          <div
            className="mb-3"
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--gold)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Voyages
          </div>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Chaque voyage est<br />
            <em style={{ color: "var(--gold)" }}>une nouvelle histoire</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Rejoignez notre communauté de voyageurs passionnés<br />
            et commencez à explorer le monde.
          </p>
        </div>
      </div>

      <div
        className="auth-form-panel luxury-form"
        style={{ maxWidth: "580px", overflowY: "auto" }}
      >
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <span className="section-eyebrow d-block mb-1" style={{ color: "var(--gold)" }}>
            Rejoignez-nous
          </span>
          <h2
            className="fw-bold mb-1"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem" }}
          >
            Créer un compte
          </h2>
          <p className="mb-4" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Déjà un compte ?{" "}
            <Link to="/login" style={{ color: "var(--gold)", fontWeight: 600 }}>
              Se connecter
            </Link>
          </p>

          {error && (
            <Alert variant="danger" className="rounded-3 border-0 mb-4 py-2 small fw-medium">
              {getErrorMessage()}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="form-label">Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex : travel_master"
                isInvalid={!!errors.username}
                {...register("username")}
              />
              <Form.Control.Feedback type="invalid" className="fw-semibold">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="form-label">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ex : vous@email.com"
                isInvalid={!!errors.email}
                {...register("email")}
              />
              <Form.Control.Feedback type="invalid" className="fw-semibold">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="form-label">Mot de passe</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Au moins 8 caractères"
                  className="password-input"
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
                <div className="invalid-feedback d-block fw-semibold mt-1">
                  {errors.password.message}
                </div>
              )}
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col>
                <Form.Group controlId="firstName">
                  <Form.Label className="form-label">Prénom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex : John"
                    isInvalid={!!errors.firstName}
                    {...register("firstName")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-semibold">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label className="form-label">Nom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex : Doe"
                    isInvalid={!!errors.lastName}
                    {...register("lastName")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-semibold">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-4">
              <Col>
                <Form.Group controlId="gender">
                  <Form.Label className="form-label">Genre</Form.Label>
                  <Form.Select {...register("gender")}>
                    <option value="">Non précisé</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="none">Autre</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="avatar">
                  <Form.Label className="form-label">Avatar (URL)</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://…"
                    isInvalid={!!errors.avatar}
                    {...register("avatar")}
                  />
                  <Form.Control.Feedback type="invalid" className="fw-semibold">
                    {errors.avatar?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              className="w-100 btn-gold rounded-pill py-3 fw-bold"
              style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
              disabled={status === "pending"}
            >
              {status === "pending" ? (
                <Spinner as="span" animation="border" size="sm" className="me-2" />
              ) : null}
              Créer mon compte
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
