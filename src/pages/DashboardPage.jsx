import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Button,
  Image,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../features/contact/contactSlice";
import { apiRequest } from "../api/apiClient";
import { Link } from "react-router-dom";
import {
  fetchDestinations,
  removeDestination,
} from "../features/destinations/destinationSlice";

function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    contacts,
    status: contactStatus,
    error: contactError,
  } = useSelector((state) => state.contact);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const { items: destinations, status: destStatus } = useSelector(
    (state) => state.destinations
  );

  useEffect(() => {
    dispatch(fetchContacts());
    dispatch(fetchDestinations());
    const loadUsers = async () => {
      try {
        const usersData = await apiRequest("/users/index.php", {
          method: "GET",
        });
        setUsers(usersData || []);
      } catch (err) {
        setUsersError(err.message);
      } finally {
        setIsUsersLoading(false);
      }
    };
    loadUsers();
  }, [dispatch]);

  if (isUsersLoading || contactStatus === "pending") {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  const handleDeleteDestination = async (id, name) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la destination "${name}" ? Cette action est irréversible.`
      )
    ) {
      try {
        await dispatch(removeDestination(id)).unwrap();
      } catch (err) {
        alert("Erreur lors de la suppression : " + err);
      }
    }
  };

  return (
    <section className="bg-light min-vh-100 py-4">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h1 className="fw-bold text-dark mb-1">Espace Administration</h1>
            <p className="text-muted mb-0">
              Gérez les membres, les voyages et consultez les requêtes.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              as={Link}
              to="/dashboard/add-destination"
              variant="primary"
              className="shadow-sm rounded-pill px-4 fw-bold"
            >
              ➕ Ajouter une destination
            </Button>

            <Button
              variant="white"
              className="border shadow-sm rounded-pill px-4 fw-bold"
              onClick={() => {
                dispatch(fetchContacts());
                dispatch(fetchDestinations());
              }}
            >
              🔄 Actualiser
            </Button>
          </div>
        </div>

        {(usersError || contactError) && (
          <Alert variant="danger" className="border-0 shadow-sm rounded-4 mb-4">
            <Alert.Heading className="fs-6 fw-bold">
              Erreur de synchronisation
            </Alert.Heading>
            <p className="mb-0 small">{usersError || contactError}</p>
          </Alert>
        )}

        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary fs-4">
                    👥
                  </div>
                  <Badge
                    bg="success"
                    className="rounded-pill bg-opacity-10 text-success border border-success"
                  >
                    Actifs
                  </Badge>
                </div>
                <h6 className="text-muted fw-semibold text-uppercase small mb-1">
                  Membres inscrits
                </h6>
                <h2 className="fw-bold mb-0">{users.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info fs-4">
                    🌍
                  </div>
                </div>
                <h6 className="text-muted fw-semibold text-uppercase small mb-1">
                  Destinations
                </h6>
                <h2 className="fw-bold mb-0">{destinations?.length || 0}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-dark text-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-10 p-3 rounded-3 text-white fs-4">
                    🛡️
                  </div>
                </div>
                <h6 className="text-white text-opacity-50 fw-semibold text-uppercase small mb-1">
                  Rôle Actuel
                </h6>
                <h2 className="fw-bold mb-0">Administrateur</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <Card.Body className="p-0">
            <Tabs
              defaultActiveKey="contacts"
              className="custom-tabs px-4 pt-3 border-bottom"
            >
              <Tab
                eventKey="contacts"
                title={<span className="py-2 d-inline-block">📬 Messages</span>}
              >
                <div className="p-0">
                  <Table
                    responsive
                    hover
                    className="align-middle mb-0 custom-table"
                  >
                    <thead>
                      <tr>
                        <th className="ps-4">Expéditeur</th>
                        <th>Sujet du message</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((msg) => (
                        <tr key={msg.id}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary"
                                style={{ width: "40px", height: "40px" }}
                              >
                                {msg.name.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-bold text-dark">
                                  {msg.name}
                                </div>
                                <div className="text-muted small">
                                  {msg.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark mb-1">
                              {msg.subject}
                            </div>
                            <div
                              className="text-muted small text-truncate"
                              style={{ maxWidth: "350px" }}
                            >
                              {msg.message}
                            </div>
                          </td>
                          <td>
                            <span className="text-muted small">
                              {msg.created_at
                                ? new Date(msg.created_at).toLocaleDateString()
                                : "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab
                eventKey="users"
                title={
                  <span className="py-2 d-inline-block">👥 Utilisateurs</span>
                }
              >
                <div className="p-0">
                  <Table
                    responsive
                    hover
                    className="align-middle mb-0 custom-table"
                  >
                    <thead>
                      <tr>
                        <th className="ps-4">Utilisateur</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th className="text-end pe-4">Date Inscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <Image
                                src={
                                  u.avatar ||
                                  u.image ||
                                  `https://ui-avatars.com/api/?name=${u.username}&background=random`
                                }
                                roundedCircle
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                                className="border"
                              />
                              <div>
                                <div className="fw-bold text-dark">
                                  {u.first_name || u.firstName}{" "}
                                  {u.last_name || u.lastName}
                                </div>
                                <div className="text-muted small">
                                  @{u.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted">{u.email}</td>
                          <td>
                            <Badge
                              bg={u.role === "admin" ? "dark" : "white"}
                              className={`rounded-pill border px-3 py-2 ${u.role === "admin" ? "" : "text-dark fw-medium"}`}
                            >
                              {u.role === "admin"
                                ? "🛡️ Administrateur"
                                : "👤 Membre"}
                            </Badge>
                          </td>
                          <td className="text-end pe-4 text-muted small">
                            {u.created_at
                              ? new Date(u.created_at).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab
                eventKey="destinations"
                title={
                  <span className="py-2 d-inline-block">🌍 Destinations</span>
                }
              >
                <div className="p-0">
                  <Table
                    responsive
                    hover
                    className="align-middle mb-0 custom-table"
                  >
                    <thead>
                      <tr>
                        <th className="ps-4">Destination</th>
                        <th>Région</th>
                        <th>Auteur</th>
                        <th className="text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {destinations.map((dest) => (
                        <tr key={dest.id}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <Image
                                src={dest.image}
                                rounded
                                style={{
                                  width: "60px",
                                  height: "45px",
                                  objectFit: "cover",
                                }}
                                className="shadow-sm border"
                              />
                              <div>
                                <div className="fw-bold text-dark">{dest.name}</div>
                                <div className="text-muted small">{dest.capital}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge
                              bg="info"
                              className="rounded-pill text-white px-3 py-2"
                            >
                              {dest.region_name || dest.region || `Région #${dest.region_id}`}
                            </Badge>
                          </td>
                          <td>
                            <span className="text-muted small fw-medium">
                              {dest.creator_username ? `@${dest.creator_username}` : "Inconnu"}
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            {Number(dest.creator_id) === Number(user?.id) ? (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-pill px-3 fw-bold shadow-sm"
                                onClick={() =>
                                  handleDeleteDestination(dest.id, dest.name)
                                }
                              >
                                Supprimer
                              </Button>
                            ) : (
                              <Badge bg="light" text="muted" className="rounded-pill px-3 py-2 border">
                                Non autorisé
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                      {destinations.length === 0 && destStatus !== "pending" && (
                        <tr>
                          <td colSpan="4" className="text-center py-5 text-muted">
                            Aucune destination dans le catalogue.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default DashboardPage;