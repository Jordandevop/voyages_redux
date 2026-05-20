import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container, Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { loginUser } from "../features/auth/authSlice";

const loginSchema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est requis"),
  password: yup.string().required("Le mot de passe est requis"),
});

function LoginPage() {
  
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { status, error} = useSelector((state)=> state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    
    try {
      await dispatch(loginUser(data)).unwrap()
      //unwrap est une méthode de Redux Toolkit
      // Succès : retourne les données (payload)
      // echec: throw error

    
      navigate("/profile");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Container className="py-5 d-flex justify-content-center">
        <Card
          className="shadow-sm border-0 rounded-4 p-4"
          style={{ maxWidth: "700px", width: "100%" }}
        >
          <Card.Body>
            <h2 className="fw-bold text-center mb-4">Connexion</h2>

            {error && (
              <Alert variant="danger" className="text-center rounded-3">
                {error}
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
              </Row>
              <Button
                type="submit"
                variant="primary"
                className="w-100 mt-4 rounded-pill fw-bold"
              >
                Se connecter
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default LoginPage;