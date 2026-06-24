import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

const loginSchema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est requis"),
  password: yup.string().required("Le mot de passe est requis"),
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate("/profile");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="auth-split">
  
      <div
        className="auth-image-panel d-none d-lg-block"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2016/01/09/18/27/journey-1130732_1280.jpg')",
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
            Le monde appartient<br />
            <em style={{ color: "var(--gold)" }}>à ceux qui osent</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Des destinations exclusives, soigneusement sélectionnées<br />
            pour les voyageurs les plus exigeants.
          </p>
        </div>
      </div>

      <div className="auth-form-panel luxury-form">
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <span
            className="section-eyebrow d-block mb-1"
            style={{ color: "var(--gold)" }}
          >
            Bienvenue
          </span>
          <h2
            className="fw-bold mb-1"
            style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem" }}
          >
            Connexion
          </h2>
          <p className="mb-4" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Pas encore de compte ?{" "}
            <Link to="/register" style={{ color: "var(--gold)", fontWeight: 600 }}>
              S'inscrire
            </Link>
          </p>

          {error && (
            <Alert variant="danger" className="rounded-3 border-0 mb-4 py-2 small fw-medium">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="form-label">Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex : travel_master"
                className="form-control"
                isInvalid={!!errors.username}
                {...register("username")}
              />
              <Form.Control.Feedback type="invalid" className="fw-semibold">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="form-label">Mot de passe</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  className="form-control password-input"
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

            <Button
              type="submit"
              className="w-100 btn-gold rounded-pill py-3 fw-bold"
              style={{ fontSize: "0.9rem", letterSpacing: "0.05em" }}
              disabled={status === "pending"}
            >
              {status === "pending" ? (
                <Spinner as="span" animation="border" size="sm" className="me-2" />
              ) : null}
              Se connecter
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
