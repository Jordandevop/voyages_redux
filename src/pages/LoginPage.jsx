import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const loginSchema = yup.object({
  username: yup.string().required("Le nom d'utilisateur est requis"),

  password: yup.string().required("Le mot de passe est requis"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

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
    console.log("Tentative de connexion validée par Yup :", data);
    setApiError("");
    try {
      const response = await fetch("https://dummyjson.com/auth/login",{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username:data.username,
          password:data.password,
        })
      }
    )
      if(!response.ok){
        throw new Error("Identifiants incorrects")
      }
      const result = await response.json();
      console.log(result);
      login(result, result.accessToken)
      navigate("/profile")
      
    } catch (error) {
      setApiError(error.message)
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

            {apiError && (
              <Alert variant="danger" className="text-center rounded-3">
                {apiError}
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
                    <Form.Control
                      type="password"
                      placeholder="Ex: 123password/"
                      className="py-2.5"
                      isInvalid={!!errors.password}
                      {...register("password")}
                    />
                    <Form.Control.Feedback type="invalid" className="fw-bold">
                      {errors.password?.message}
                    </Form.Control.Feedback>
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
