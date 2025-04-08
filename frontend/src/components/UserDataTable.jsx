import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { secureRequest, parseJwt, getAccessToken } from "../services/authService";
import Swal from "sweetalert2"; // npm install sweetalert2
import { Modal, Button } from "react-bootstrap"; // Asegúrate de instalar react-bootstrap si no lo tienes

const UserDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const currentUserId = parseJwt(getAccessToken())?.user_id;

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await secureRequest({
        method: "GET",
        url: "http://127.0.0.1:8000/users/api/",
      });
      setData(response.data);
    } catch (err) {
      console.error("Error al cargar los usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleDelete = async (user) => {
    if (user.id === currentUserId) {
      Swal.fire("¡Error!", "No puedes eliminarte a ti mismo.", "error");
      return;
    }

    const result = await Swal.fire({
      title: `¿Eliminar a ${user.name}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await secureRequest({
          method: "DELETE",
          url: `http://127.0.0.1:8000/users/api/${user.id}/`,
        });

        Swal.fire("¡Eliminado!", `${user.name} fue eliminado.`, "success");
        getUsers();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);  // Guardamos el usuario a editar
    setShowModal(true);      // Mostramos el modal
  };

  const handleUpdate = async () => {
    try {
      await secureRequest({
        method: "PUT",
        url: `http://127.0.0.1:8000/users/api/${selectedUser.id}/`,
        data: selectedUser,
      });

      Swal.fire("¡Actualizado!", "El usuario ha sido actualizado.", "success");
      setShowModal(false);
      getUsers();  // Actualiza la lista de usuarios
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
      console.error("Error al actualizar:", error);
    }
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.tel,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <span>
          <button className="btn btn-warning me-2" onClick={() => handleEdit(row)}>
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn btn-danger me-2" onClick={() => handleDelete(row)}>
            <i className="bi bi-trash"></i>
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h3>Tabla de usuarios</h3>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
      />

      {/* Modal de edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="surname" className="form-label">Apellido</label>
                <input
                  type="text"
                  id="surname"
                  className="form-control"
                  value={selectedUser.surname}
                  onChange={(e) => setSelectedUser({ ...selectedUser, surname: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">Teléfono</label>
                <input
                  type="text"
                  id="tel"
                  className="form-control"
                  value={selectedUser.tel}
                  onChange={(e) => setSelectedUser({ ...selectedUser, tel: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="control_number" className="form-label">Número de Control</label>
                <input
                  type="text"
                  id="control_number"
                  className="form-control"
                  value={selectedUser.control_number}
                  onChange={(e) => setSelectedUser({ ...selectedUser, control_number: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="age" className="form-label">Edad</label>
                <input
                  type="number"
                  id="age"
                  className="form-control"
                  value={selectedUser.age}
                  onChange={(e) => setSelectedUser({ ...selectedUser, age: e.target.value })}
                />
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDataTable;
