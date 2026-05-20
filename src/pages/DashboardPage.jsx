import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Tabs, Tab, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../features/contact/contactSlice";
import { apiRequest } from "../api/apiClient"; 

function DashboardPage() {
  const dispatch = useDispatch();
  
  const { contacts, status: contactStatus, error: contactError } = useSelector((state) => state.contact);


  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {

    dispatch(fetchContacts());

    const loadUsers = async () => {
      try {
        const usersData = await apiRequest('/users/index.php', { method: 'GET' });
        setUsers(usersData || []);
      } catch (err) {
        setUsersError("Impossible de charger les utilisateurs : " + err.message);
      } finally {
        setIsUsersLoading(false);
      }
    };

    loadUsers();
  }, [dispatch]);

  if (isUsersLoading || contactStatus === 'pending') {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">⚙️ Dashboard Administrateur</h2>
      </div>

      {(usersError || contactError) && (
        <Alert variant="danger" className="rounded-4 shadow-sm">
          {usersError && <div>{usersError}</div>}
          {contactError && <div>Erreur Contacts : {contactError}</div>}
        </Alert>
      )}

      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-primary text-white h-100">
            <Card.Body className="p-4 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="opacity-75 fw-bold mb-1 text-uppercase tracking-wider">Total Utilisateurs</h6>
                <h2 className="display-5 fw-bold mb-0">{users.length}</h2>
              </div>
              <div className="fs-1 opacity-50">👥</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm rounded-4 bg-dark text-white h-100">
            <Card.Body className="p-4 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="opacity-75 fw-bold mb-1 text-uppercase tracking-wider">Messages Reçus</h6>
                <h2 className="display-5 fw-bold mb-0">{contacts.length}</h2>
              </div>
              <div className="fs-1 opacity-50">✉️</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          <Tabs
            defaultActiveKey="contacts"
            id="dashboard-tabs"
            className="px-4 pt-4 border-bottom-0"
          >
            <Tab eventKey="contacts" title="✉️ Demandes de contact">
              <div className="p-4">
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Sujet & Message</th>
                      <th>Date</th>
                      <th className="text-end">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length > 0 ? (
                      contacts.map((msg) => (
                        <tr key={msg.id}>
                          <td className="text-muted small">#{msg.id}</td>
                          <td>
                            <div className="fw-bold">{msg.name}</div>
                            <div className="text-muted small">{msg.email}</div>
                            {msg.user_id && (
                              <Badge bg="info" className="mt-1" style={{ fontSize: "0.6rem" }}>
                                Inscrit (ID: {msg.user_id})
                              </Badge>
                            )}
                          </td>
                          <td style={{ maxWidth: "300px" }}>
                            <div className="fw-semibold text-truncate">{msg.subject}</div>
                            <div className="text-muted small text-truncate">{msg.message}</div>
                          </td>
                          <td className="text-muted small">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="text-end">
                            <Button variant="outline-primary" size="sm" className="rounded-pill px-3">
                              Répondre
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          Aucun message reçu pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>

            {/* ONGLET 2 : UTILISATEURS INSCRITS */}
            <Tab eventKey="users" title="👥 Utilisateurs">
              <div className="p-4">
                <Table responsive hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Identité</th>
                      <th>Contact</th>
                      <th>Rôle</th>
                      <th className="text-end">Inscription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="text-muted small">#{user.id}</td>
                          <td>
                            <div className="fw-bold">{user.first_name || user.firstName} {user.last_name || user.lastName}</div>
                            <div className="text-muted small">@{user.username}</div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <Badge 
                              bg={user.role === 'admin' ? 'danger' : 'light'} 
                              text={user.role === 'admin' ? 'light' : 'dark'}
                              className="border px-3 py-2 rounded-pill text-uppercase"
                              style={{ fontSize: "0.65rem" }}
                            >
                              {user.role || 'membre'}
                            </Badge>
                          </td>
                          <td className="text-muted small text-end">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5 text-muted">
                          Aucun utilisateur trouvé.
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
  );
}

export default DashboardPage;