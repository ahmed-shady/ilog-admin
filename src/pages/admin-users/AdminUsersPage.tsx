import { useState } from "react";
import { Button, ButtonGroup, Card, Modal, Table } from "react-bootstrap";

interface AdminUser {
  id: number;
  name: string;
}

const FAKE_USERS: AdminUser[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Carol White" },
  { id: 4, name: "David Brown" },
  { id: 5, name: "Eva Martinez" },
  { id: 6, name: "Frank Lee" },
  { id: 7, name: "Grace Kim" },
  { id: 8, name: "Henry Wilson" },
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>(FAKE_USERS);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const handleDelete = () => {
    if (!userToDelete) return;
    setUsers(users.filter((u) => u.id !== userToDelete.id));
    setUserToDelete(null);
  };

  return (
    <>
      {userToDelete && (
        <Modal show onHide={() => setUserToDelete(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Admin User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{userToDelete.name}</strong>
            ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Card className="card">
        <Card.Header>
          <h3>
            <i className="fas fa-users-cog me-2"></i> Admin Users
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <p className="m-0 d-flex align-items-center">
              Total users:
              <strong className="px-1">{users.length}</strong>
            </p>
            <Button
              variant="info"
              className="text-light"
              title="Add new admin user"
            >
              New <i className="fas fa-plus"></i>
            </Button>
          </div>
          <Table bordered striped responsive>
            <thead>
              <tr>
                <th className="text-center" scope="col">
                  #
                </th>
                <th className="text-center" scope="col">
                  Name
                </th>
                <th className="text-center" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr className="text-center" key={user.id}>
                  <th className="text-center" scope="row">
                    {idx + 1}
                  </th>
                  <td>{user.name}</td>
                  <td>
                    <ButtonGroup size="sm">
                      <button
                        type="button"
                        title="edit"
                        className="action-btn btn btn-success"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        title="delete"
                        className="action-btn btn btn-danger"
                        onClick={() => setUserToDelete(user)}
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default AdminUsersPage;
