import { useState, useEffect } from "react";
import {
  Container, Row, Col, Card, Form, Button,
  Spinner, Alert, Image, Tab, Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, changePassword, resetProfileStatus } from "../features/users/usersSlice";
import { updateLocalUser, logout } from "../features/auth/authSlice";
import { apiRequest } from "../api/apiClient";

const profileSchema = yup.object({
  username:  yup.string().required("Le pseudo est requis.").min(4, "4 caractères minimum."),
  firstName: yup.string().required("Le prénom est requis."),
  lastName:  yup.string().required("Le nom est requis."),
  gender:    yup.string().notRequired(),
  image:     yup.string().url("Doit être une URL valide.").notRequired().transform(v => v === "" ? undefined : v),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Mot de passe actuel requis."),
  newPassword: yup
    .string()
    .required("Nouveau mot de passe requis.")
    .min(8, "Minimum 8 caractères.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Doit contenir majuscule, minuscule, chiffre et caractère spécial."
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Les mots de passe ne correspondent pas.")
    .required("Confirmation requise."),
});


function UserComments() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    apiRequest("/comments/by-user.php", { method: "GET" })
      .then((data) => setComments(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: "var(--gold)" }} />
      </div>
    );

  if (error)
    return <Alert variant="danger" className="border-0 rounded-3 small">{error}</Alert>;

  if (comments.length === 0)
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: "2.5rem", opacity: 0.3, marginBottom: "1rem" }}>✍️</div>
        <p className="fw-medium" style={{ color: "var(--text-muted)" }}>
          Aucun avis publié pour l'instant.
        </p>
        <p className="small" style={{ color: "var(--text-muted)" }}>
          Laissez des avis sur les pages de destinations pour les retrouver ici.
        </p>
      </div>
    );

  const c = comments[activeIndex];
  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(comments.length - 1, i + 1));

  return (
    <div>
      <div
        className="p-4 mb-3"
        style={{
          background: "var(--white)",
          borderRadius: "1rem",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              style={{ fontSize: "1.1rem" }}
              className={s <= (c.rating || 0) ? "star-active" : "star-empty"}
            >
              ★
            </span>
          ))}
        </div>

        <h6
          className="fw-bold mb-2"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--text-dark)" }}
        >
          {c.destination_name || "Destination Mystère"}
        </h6>

        <p
          className="fst-italic mb-3"
          style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}
        >
          "{c.content}"
        </p>

        <Button
          as={Link}
          to={`/destination/${c.destination_slug || c.destination_id}`}
          size="sm"
          className="rounded-pill px-4 fw-bold"
          style={{ background: "var(--navy)", border: "none", color: "#fff", fontSize: "0.8rem" }}
        >
          Revoir la destination →
        </Button>
      </div>

  
      {comments.length > 1 && (
        <div className="d-flex align-items-center justify-content-between">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            style={{
              background: activeIndex === 0 ? "var(--cream-dark)" : "var(--navy)",
              color: activeIndex === 0 ? "var(--text-muted)" : "#fff",
              border: "none",
              borderRadius: "2rem",
              padding: "0.4rem 1rem",
              fontSize: "0.78rem",
              cursor: activeIndex === 0 ? "default" : "pointer",
              fontWeight: 600,
            }}
          >
            ← Précédent
          </button>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {activeIndex + 1} / {comments.length}
          </span>
          <button
            onClick={next}
            disabled={activeIndex === comments.length - 1}
            style={{
              background: activeIndex === comments.length - 1 ? "var(--cream-dark)" : "var(--navy)",
              color: activeIndex === comments.length - 1 ? "var(--text-muted)" : "#fff",
              border: "none",
              borderRadius: "2rem",
              padding: "0.4rem 1rem",
              fontSize: "0.78rem",
              cursor: activeIndex === comments.length - 1 ? "default" : "pointer",
              fontWeight: 600,
            }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}


export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { updateStatus, updateError, passwordStatus, passwordError } = useSelector(
    (state) => state.users
  );

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

 
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username:  user?.username  || "",
      firstName: user?.firstName || "",
      lastName:  user?.lastName  || "",
      gender:    user?.gender    || "",
      image:     user?.image     || "",
    },
  });

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: pwdErrors },
    reset: resetPwd,
  } = useForm({ resolver: yupResolver(passwordSchema) });

  useEffect(() => {
    return () => dispatch(resetProfileStatus());
  }, [dispatch]);

  const onProfileSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      dispatch(updateLocalUser(data));
    } catch (_) {}
  };

  const onPasswordSubmit = async (data) => {
    try {
      await dispatch(changePassword(data)).unwrap();
      resetPwd();
    } catch (_) {}
  };

  const handleLogout = () => dispatch(logout());

  if (!user) return null;

  const initials =
    ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() ||
    user.username?.[0]?.toUpperCase() ||
    "V";

  return (
    <>
      <div
        className="profile-header-band"
        style={{
          background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)",
          padding: "4rem 0 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
     
        <div style={{
          position: "absolute", top: "-50%", right: "-5%",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "rgba(201,161,74,0.07)", pointerEvents: "none",
        }} />
        <Container style={{ position: "relative", zIndex: 2 }}>
          <div className="d-flex align-items-center gap-4 flex-wrap">

            {user.image ? (
              <Image
                src={user.image}
                roundedCircle
                style={{
                  width: "96px", height: "96px", objectFit: "cover",
                  border: "3px solid var(--gold)", boxShadow: "0 0 0 5px rgba(201,161,74,0.15)",
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center fw-bold rounded-circle"
                style={{
                  width: "96px", height: "96px", flexShrink: 0,
                  background: "rgba(201,161,74,0.15)",
                  border: "3px solid var(--gold)",
                  boxShadow: "0 0 0 5px rgba(201,161,74,0.12)",
                  color: "var(--gold)",
                  fontSize: "2rem",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <h1
                className="fw-bold mb-1"
                style={{ fontFamily: "Playfair Display, serif", color: "#fff", fontSize: "2rem" }}
              >
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.username}
              </h1>
              <p style={{ color: "var(--gold)", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                @{user.username}
              </p>
              {user.email && (
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginBottom: 0 }}>
                  {user.email}
                </p>
              )}
            </div>

            <div className="ms-auto">
              <Button
                onClick={handleLogout}
                variant="link"
                className="text-decoration-none"
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", letterSpacing: "0.05em" }}
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Tab.Container defaultActiveKey="profile">

          <Nav className="custom-tabs border-bottom mb-4" style={{ gap: "0.5rem" }}>
            <Nav.Item>
              <Nav.Link eventKey="profile">Mon Profil</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="password">Mot de passe</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviews">Mes Avis</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>

            <Tab.Pane eventKey="profile">
              <Row className="justify-content-center">
                <Col lg={7}>
                  <Card
                    className="border-0 shadow-sm"
                    style={{ borderRadius: "1rem", background: "var(--white)" }}
                  >
                    <Card.Body className="p-4 p-lg-5 luxury-form">
                      <span className="section-eyebrow">Informations</span>
                      <h4
                        className="fw-bold mb-4 mt-1"
                        style={{ fontFamily: "Playfair Display, serif", color: "var(--text-dark)" }}
                      >
                        Modifier mon profil
                      </h4>

                      {updateStatus === "success" && (
                        <Alert variant="success" className="border-0 rounded-3 mb-4 small fw-medium">
                          Profil mis à jour avec succès !
                        </Alert>
                      )}
                      {updateError && (
                        <Alert variant="danger" className="border-0 rounded-3 mb-4 small fw-medium">
                          {updateError}
                        </Alert>
                      )}

                      <Form onSubmit={handleProfile(onProfileSubmit)}>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group controlId="firstName">
                              <Form.Label className="form-label">Prénom</Form.Label>
                              <Form.Control
                                type="text"
                                isInvalid={!!profileErrors.firstName}
                                {...regProfile("firstName")}
                              />
                              <Form.Control.Feedback type="invalid" className="fw-semibold">
                                {profileErrors.firstName?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="lastName">
                              <Form.Label className="form-label">Nom</Form.Label>
                              <Form.Control
                                type="text"
                                isInvalid={!!profileErrors.lastName}
                                {...regProfile("lastName")}
                              />
                              <Form.Control.Feedback type="invalid" className="fw-semibold">
                                {profileErrors.lastName?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="username">
                              <Form.Label className="form-label">Pseudo</Form.Label>
                              <Form.Control
                                type="text"
                                isInvalid={!!profileErrors.username}
                                {...regProfile("username")}
                              />
                              <Form.Control.Feedback type="invalid" className="fw-semibold">
                                {profileErrors.username?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="gender">
                              <Form.Label className="form-label">Genre</Form.Label>
                              <Form.Select {...regProfile("gender")}>
                                <option value="">Non précisé</option>
                                <option value="male">Homme</option>
                                <option value="female">Femme</option>
                                <option value="none">Autre</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group controlId="image">
                              <Form.Label className="form-label">Avatar (URL)</Form.Label>
                              <Form.Control
                                type="url"
                                placeholder="https://…"
                                isInvalid={!!profileErrors.image}
                                {...regProfile("image")}
                              />
                              <Form.Control.Feedback type="invalid" className="fw-semibold">
                                {profileErrors.image?.message}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <Button
                          type="submit"
                          className="mt-4 rounded-pill px-5 py-2 fw-bold"
                          style={{
                            background: "var(--navy)", border: "none", color: "#fff",
                            fontSize: "0.875rem", letterSpacing: "0.04em",
                          }}
                          disabled={updateStatus === "pending"}
                        >
                          {updateStatus === "pending" ? (
                            <Spinner as="span" size="sm" animation="border" className="me-2" />
                          ) : null}
                          Enregistrer les modifications
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="password">
              <Row className="justify-content-center">
                <Col lg={7}>
                  <Card
                    className="border-0 shadow-sm"
                    style={{ borderRadius: "1rem", background: "var(--white)" }}
                  >
                    <Card.Body className="p-4 p-lg-5 luxury-form">
                      <span className="section-eyebrow">Sécurité</span>
                      <h4
                        className="fw-bold mb-4 mt-1"
                        style={{ fontFamily: "Playfair Display, serif", color: "var(--text-dark)" }}
                      >
                        Changer mon mot de passe
                      </h4>

                      {passwordStatus === "success" && (
                        <Alert variant="success" className="border-0 rounded-3 mb-4 small fw-medium">
                          Mot de passe modifié avec succès !
                        </Alert>
                      )}
                      {passwordError && (
                        <Alert variant="danger" className="border-0 rounded-3 mb-4 small fw-medium">
                          {passwordError}
                        </Alert>
                      )}

                      <Form onSubmit={handlePwd(onPasswordSubmit)}>
                        {[
                          { id: "currentPassword", label: "Mot de passe actuel", show: showCurrent, toggle: setShowCurrent },
                          { id: "newPassword",     label: "Nouveau mot de passe", show: showNew,     toggle: setShowNew },
                          { id: "confirmPassword", label: "Confirmer le mot de passe", show: showConfirm, toggle: setShowConfirm },
                        ].map(({ id, label, show, toggle }) => (
                          <Form.Group key={id} className="mb-3" controlId={id}>
                            <Form.Label className="form-label">{label}</Form.Label>
                            <div className="position-relative">
                              <Form.Control
                                type={show ? "text" : "password"}
                                placeholder="••••••••"
                                className="password-input"
                                isInvalid={!!pwdErrors[id]}
                                {...regPwd(id)}
                              />
                              <span
                                onClick={() => toggle(!show)}
                                className="text-muted password-icon"
                                style={{ fontSize: "1rem" }}
                              >
                                {show ? "🙉" : "🙈"}
                              </span>
                            </div>
                            {pwdErrors[id] && (
                              <div className="invalid-feedback d-block fw-semibold mt-1">
                                {pwdErrors[id].message}
                              </div>
                            )}
                          </Form.Group>
                        ))}

                        <Button
                          type="submit"
                          className="mt-2 rounded-pill px-5 py-2 fw-bold"
                          style={{
                            background: "var(--navy)", border: "none", color: "#fff",
                            fontSize: "0.875rem", letterSpacing: "0.04em",
                          }}
                          disabled={passwordStatus === "pending"}
                        >
                          {passwordStatus === "pending" ? (
                            <Spinner as="span" size="sm" animation="border" className="me-2" />
                          ) : null}
                          Mettre à jour le mot de passe
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane eventKey="reviews">
              <Row className="justify-content-center">
                <Col lg={7}>
                  <span className="section-eyebrow d-block mb-1">Journal</span>
                  <h4
                    className="fw-bold mb-4"
                    style={{ fontFamily: "Playfair Display, serif", color: "var(--text-dark)" }}
                  >
                    Mes avis de voyage
                  </h4>
                  <UserComments />
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}
