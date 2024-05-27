import { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import MapIcon from "@mui/icons-material/Map";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { logout } from "./authService";
import { AuthContext } from "../context";

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    console.log("Logging out");
    await logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleInfo = () => {
    handleMenuClose();
    navigate("/information"); // Navigate to information page
  };

  const handleAddUser = () => {
    handleMenuClose();
    navigate("/user"); // Navigate to add user page
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            HomePage
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleInfo}>Information</MenuItem>
              <MenuItem onClick={handleAddUser}>Add User</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            marginTop: 8,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={() => navigate("/")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home Page" />
            </ListItem>
            <ListItem button onClick={() => navigate("/store")}>
              <ListItemIcon>
                <StoreIcon />
              </ListItemIcon>
              <ListItemText primary="Retrieve" />
            </ListItem>
            <ListItem button onClick={() => navigate("/live-map")}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Live Map" />
            </ListItem>
            <ListItem button onClick={() => navigate("/inventory_list")}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Inventory list" />
            </ListItem>
            <ListItem button onClick={() => navigate("/order_store_list")}>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Order/store list" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemText primary={`Version: 1.0.0`} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default TopBar;
