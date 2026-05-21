import { Container, Row, Col, Card, Form, Button, Image, Badge, Spinner, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { logout, updateLocalUser } from "../features/auth/authSlice";
import { updateProfile, changePassword, resetProfileStatus } from "../features/users/usersSlice";

// --- SCHÉMAS DE VALIDATION ---
const profileSchema = yup.object({
  username: yup.string().required("Le pseudo est requis.").min(4, "Minimum 4 caractères."),
  email: yup.string().email("Email invalide.").required("L'email est requis."),
  firstName: yup.string().required("Le prénom est requis."),
  lastName: yup.string().required("Le nom est requis."),
  gender: yup.string().notRequired(),
  avatar: yup.string().url("Doit être une URL valide.").notRequired(),
}).required();

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Mot de passe actuel requis."),
  newPassword: yup.string()
    .required("Nouveau mot de passe requis.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial."
    ),
  confirmPassword: yup.string()
    .required("Veuillez confirmer.")
    .oneOf([yup.ref('newPassword')], "Les mots de passe ne correspondent pas."),
}).required();

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // On utilise directement le user du store Redux pour que la modification soit répercutée sur la Navbar
  const { user } = useSelector((state) => state.auth);
  const { updateStatus, updateError, passwordStatus, passwordError } = useSelector((state) => state.users);

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // --- FORMULAIRE 1 : PROFIL ---
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || user?.first_name || "",
      lastName: user?.lastName || user?.last_name || "",
      gender: user?.gender || "",
      avatar: user?.avatar || user?.image || "",
    },
  });

  // --- FORMULAIRE 2 : MOT DE PASSE ---
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Nettoyage en quittant la page
  useEffect(() => {
    return () => dispatch(resetProfileStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const onProfileUpdate = async (data) => {
    setProfileSuccess(false);
    try {
      await dispatch(updateProfile(data)).unwrap();
      dispatch(updateLocalUser(data)); // Synchronise la Navbar
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const onPasswordUpdate = async (data) => {
    setPasswordSuccess(false);
    try {
      await dispatch(changePassword(data)).unwrap();
      setPasswordSuccess(true);
      resetPasswordForm();
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      
      {/* 1. VOTRE EN-TÊTE CONSERVÉ */}
      <div className="d-flex flex-column align-items-center mb-5 text-center">
        <Image
          src={user?.avatar || user?.image || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
          roundedCircle
          className="mb-3 shadow-sm border"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
        <h2 className="fw-bold mb-1">
          {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
        </h2>
        <p className="text-muted mb-3">@{user?.username}</p>
        <Badge bg={user?.role === "admin" ? "dark" : "light"} text={user?.role === "admin" ? "light" : "dark"} className="px-3 py-2 rounded-pill border">
          {user?.role === "admin" ? "Administrateur" : "Membre"}
        </Badge>
      </div>

      <Row className="g-4">
        {/* 2. FORMULAIRE DE MODIFICATION DES INFOS */}
        <Col md={7}>
          <Card className="bg-white rounded-4 border-0 p-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4">Modifier mes informations</h5>

            {profileSuccess && <Alert variant="success" className="py-2 small fw-medium">✅ Profil mis à jour avec succès.</Alert>}
            {updateError && <Alert variant="danger" className="py-2 small fw-medium">⚠️ {updateError}</Alert>}

            <Form onSubmit={handleProfileSubmit(onProfileUpdate)}>
              <Row className="g-3">
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Prénom</Form.Label>
                    <Form.Control type="text" isInvalid={!!profileErrors.firstName} {...registerProfile("firstName")} />
                    <Form.Control.Feedback type="invalid">{profileErrors.firstName?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Nom</Form.Label>
                    <Form.Control type="text" isInvalid={!!profileErrors.lastName} {...registerProfile("lastName")} />
                    <Form.Control.Feedback type="invalid">{profileErrors.lastName?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Pseudo</Form.Label>
                    <Form.Control type="text" isInvalid={!!profileErrors.username} {...registerProfile("username")} />
                    <Form.Control.Feedback type="invalid">{profileErrors.username?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Genre</Form.Label>
                    <Form.Select isInvalid={!!profileErrors.gender} {...registerProfile("gender")}>
                      <option value="">Non défini</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">Email</Form.Label>
                    <Form.Control type="email" isInvalid={!!profileErrors.email} {...registerProfile("email")} />
                    <Form.Control.Feedback type="invalid">{profileErrors.email?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group>
                    <Form.Label className="small fw-semibold text-muted">URL de l'Avatar</Form.Label>
                    <Form.Control type="url" placeholder="https://..." isInvalid={!!profileErrors.avatar} {...registerProfile("avatar")} />
                    <Form.Control.Feedback type="invalid">{profileErrors.avatar?.message}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="primary" className="w-100 mt-4 rounded-pill fw-bold" disabled={updateStatus === 'pending'}>
                {updateStatus === 'pending' ? <Spinner size="sm" animation="border" /> : "Enregistrer les infos"}
              </Button>
            </Form>
          </Card>
        </Col>

        {/* 3. FORMULAIRE DE MOT DE PASSE + DÉCONNEXION */}
        <Col md={5}>
          <Card className="bg-white rounded-4 border-0 p-4 shadow-sm h-100 d-flex flex-column">
            <h5 className="fw-bold mb-4">Sécurité</h5>

            {passwordSuccess && <Alert variant="success" className="py-2 small fw-medium">🔐 Mot de passe modifié.</Alert>}
            {passwordError && <Alert variant="danger" className="py-2 small fw-medium">⚠️ {passwordError}</Alert>}

            <Form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="mb-4">
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Mot de passe actuel</Form.Label>
                <Form.Control type="password" isInvalid={!!passwordErrors.currentPassword} {...registerPassword("currentPassword")} />
                <Form.Control.Feedback type="invalid">{passwordErrors.currentPassword?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-muted">Nouveau mot de passe</Form.Label>
                <Form.Control type="password" isInvalid={!!passwordErrors.newPassword} {...registerPassword("newPassword")} />
                <Form.Control.Feedback type="invalid">{passwordErrors.newPassword?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-muted">Confirmer le mot de passe</Form.Label>
                <Form.Control type="password" isInvalid={!!passwordErrors.confirmPassword} {...registerPassword("confirmPassword")} />
                <Form.Control.Feedback type="invalid">{passwordErrors.confirmPassword?.message}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100 rounded-pill fw-bold" disabled={passwordStatus === 'pending'}>
                {passwordStatus === 'pending' ? <Spinner size="sm" animation="border" /> : "Mettre à jour"}
              </Button>
            </Form>

            {/* Bouton de déconnexion placé en bas */}
            <div className="mt-auto pt-4 border-top">
              <Button variant="outline-danger" className="w-100 rounded-pill py-2 fw-bold" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}

export default ProfilePage;