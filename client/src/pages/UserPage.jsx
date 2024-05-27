import { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem, // Import MenuItem for the select input
  IconButton,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const SERVER_URL = "http://192.168.1.48:5001";

const UserPage = () => {
  const [openNewUser, setOpenNewUser] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "operator", // Set default role to admin
  });
  const [users, setUsers] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleAddUser = () => {
    setOpenNewUser(true);
  };

  const handleCloseNewUser = () => {
    setOpenNewUser(false);
    setNewUser({ username: "", password: "", role: "operator" }); // Reset role to admin
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/user/add_user`, {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
      });
      console.log(response.data.message);
      setAlertOpen(true);
      handleCloseNewUser();
      fetchUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleCloseCreatedUser = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmChange = (e) => {
    setDeleteConfirm(e.target.value);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
    setDeleteConfirm("");
  };

  const handleDeleteSubmit = async () => {
    if (deleteConfirm === "CONFIRM") {
      try {
        await axios.delete(`${SERVER_URL}/user/delete_user/${deleteUserId}`);
        handleDeleteClose();
        fetchUsers();
        setDeleteAlertOpen(true); // Show alert when user is deleted
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    } else {
      alert("You must type CONFIRM to delete");
    }
  };

  const handleCloseDeletedUser = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setDeleteAlertOpen(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/user/all_users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Button variant="contained" color="primary" onClick={handleAddUser}>
        Add User
      </Button>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        components={{
          Toolbar: CustomToolbar,
        }}
      />

      {/* Dialog for adding new user */}
      <Dialog open={openNewUser} onClose={handleCloseNewUser}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
          />
          <TextField
            select // Use select for dropdown
            margin="dense"
            id="role"
            label="Role"
            fullWidth
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
          >
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="operator">operator</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewUser} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert to show when user is created */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleCloseCreatedUser}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseCreatedUser}
          severity="success"
          sx={{ width: "100%" }}
        >
          New user has been successfully created.
        </Alert>
      </Snackbar>

      {/* Dialog for delete confirmation */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type CONFIRM to delete user with ID: {deleteUserId}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="deleteConfirm"
            label="Type CONFIRM to delete"
            type="text"
            fullWidth
            value={deleteConfirm}
            onChange={handleDeleteConfirmChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSubmit} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert to show when user is deleted */}
      <Snackbar
        open={deleteAlertOpen}
        autoHideDuration={5000}
        onClose={handleCloseDeletedUser}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseDeletedUser}
          severity="success"
          sx={{ width: "100%" }}
        >
          User has been successfully deleted.
        </Alert>
      </Snackbar>
    </div>
  );
};

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

export default UserPage;
