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
} from "@mui/material";
import axios from "axios";

const UserPage = () => {
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "admin", // Set default role to admin
  });
  const [users, setUsers] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "role", headerName: "Role", width: 150 },
  ];

  const handleAddUser = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewUser({ username: "", password: "", role: "admin" }); // Reset role to admin
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5001/user/add_user", {
        username: newUser.username,
        password: newUser.password,
        role: newUser.role,
      });
      console.log(response.data.message);
      setAlertOpen(true); // Show alert when user is created
      handleClose();
      // Refresh users after new user is created
      fetchUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/user/all_users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
      <Button variant="contained" color="primary" onClick={handleAddUser}>
        Add User
      </Button>
      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* Alert to show when user is created */}
      <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
        <DialogTitle>User Created</DialogTitle>
        <DialogContent>
          <p>New user has been successfully created.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
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
