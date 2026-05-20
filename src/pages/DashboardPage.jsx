import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert, Tabs, Tab, Button, Image } from "react-bootstrap";
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
        setUsersError(err.message);
      } finally {
        setIsUsersLoading(false);
      }
    };
    loadUsers();
  }, [dispatch]);

  if (isUsersLoading || contactStatus === 'pending') {
    return (
      <Container className="py-5 text-center min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="grow" variant="primary" />
      </Container>
    );
  }

  return (
    <section className="bg-light min-vh-100 py-4">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h1 className="fw-bold text-dark mb-1">Espace Administration</h1>
            <p className="text-muted mb-0">Gérez les membres et consultez les demandes de contact.</p>
          </div>
          <Button 
            variant="white" 
            className="border shadow-sm rounded-pill px-4 fw-bold"
            onClick={() => {
                dispatch(fetchContacts());
            }}
          >
            🔄 Actualiser
          </Button>
        </div>
        {(usersError || contactError) && (
          <Alert variant="danger" className="border-0 shadow-sm rounded-4 mb-4">
            <Alert.Heading className="fs-6 fw-bold">Erreur de synchronisation</Alert.Heading>
            <p className="mb-0 small">{usersError || contactError}</p>
          </Alert>
        )}

        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary fs-4">👥</div>
                  <Badge bg="success" className="rounded-pill bg-opacity-10 text-success border border-success">Actifs</Badge>
                </div>
                <h6 className="text-muted fw-semibold text-uppercase small mb-1">Membres inscrits</h6>
                <h2 className="fw-bold mb-0">{users.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning fs-4">✉️</div>
                  <Badge bg="warning" className="rounded-pill bg-opacity-10 text-warning border border-warning">Nouveau</Badge>
                </div>
                <h6 className="text-muted fw-semibold text-uppercase small mb-1">Messages reçus</h6>
                <h2 className="fw-bold mb-0">{contacts.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-dark text-white">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-10 p-3 rounded-3 text-white fs-4">🛡️</div>
                </div>
                <h6 className="text-white text-opacity-50 fw-semibold text-uppercase small mb-1">Rôle Actuel</h6>
                <h2 className="fw-bold mb-0">Administrateur</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <Card.Body className="p-0">
            <Tabs defaultActiveKey="contacts" className="custom-tabs px-4 pt-3 border-bottom">

              <Tab eventKey="contacts" title={<span className="py-2 d-inline-block">📬 Messages</span>}>
                <div className="p-0">
                  <Table responsive hover className="align-middle mb-0 custom-table">
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
                              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" style={{width: "40px", height: "40px"}}>
                                {msg.name.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{msg.name}</div>
                                <div className="text-muted small">{msg.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark mb-1">{msg.subject}</div>
                            <div className="text-muted small text-truncate" style={{maxWidth: "350px"}}>{msg.message}</div>
                          </td>
                          <td>
                            <span className="text-muted small">{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : '—'}</span>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="users" title={<span className="py-2 d-inline-block">👥 Utilisateurs</span>}>
                <div className="p-0">
                  <Table responsive hover className="align-middle mb-0 custom-table">
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
                                src={u.avatar || u.image || `https://ui-avatars.com/api/?name=${u.username}&background=random`} 
                                roundedCircle 
                                style={{width: "40px", height: "40px", objectFit: "cover"}}
                                className="border"
                              />
                              <div>
                                <div className="fw-bold text-dark">{u.first_name || u.firstName} {u.last_name || u.lastName}</div>
                                <div className="text-muted small">@{u.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted">{u.email}</td>
                          <td>
                            <Badge bg={u.role === 'admin' ? 'dark' : 'white'} className={`rounded-pill border px-3 py-2 ${u.role === 'admin' ? '' : 'text-dark fw-medium'}`}>
                              {u.role === 'admin' ? '🛡️ Administrateur' : '👤 Membre'}
                            </Badge>
                          </td>
                          <td className="text-end pe-4 text-muted small">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
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