import { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
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
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";
import { logout } from "./authService";
import { AuthContext, ServerContext, StationContext } from "../context";
import NanoIcon from "../assets/NanoIcon.png";
import axios from "axios";

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState("");
  const [stations, setStations] = useState([]);

  const navigate = useNavigate();
  const { setIsAuthenticated, userInfo } = useContext(AuthContext);
  const { SERVER_URL } = useContext(ServerContext);
  const { setCurrentStation } = useContext(StationContext);

  useEffect(() => {
    // Fetch stations from the server
    const fetchStations = async () => {
      try {
        const stationResponse = await axios.get(
          `${SERVER_URL}/setting/all_station`
        );

        setStations(stationResponse.data);
        setCurrentStation(stationResponse.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, [SERVER_URL, setCurrentStation]);

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Prevent event propagation
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
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <TextField
            select
            label="Select Station"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            size="small"
            style={{ marginRight: 16, width: "200px" }}
          >
            {stations.map((station) => (
              <MenuItem key={station.station_id} value={station.station_id}>
                {station.station_id}
              </MenuItem>
            ))}
          </TextField>
          <IconButton edge="end" onClick={() => navigate("/")}>
            <img src={NanoIcon} alt="NanoIcon" style={{ width: "40px" }} />
          </IconButton>
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
                <HomeIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Home Page" />
            </ListItem>
            <ListItem button onClick={() => navigate("/station")}>
              <ListItemIcon>
                <StoreIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Station" />
            </ListItem>
            <ListItem button onClick={() => navigate("/map")}>
              <ListItemIcon>
                <MapIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Live Map" />
            </ListItem>
            <ListItem button onClick={() => navigate("/inventory")}>
              <ListItemIcon>
                <MapIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Inventory list" />
            </ListItem>
            <ListItem button onClick={() => navigate("/order_list")}>
              <ListItemIcon>
                <MapIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Order list" />
            </ListItem>
            <ListItem button onClick={() => navigate("/store_list")}>
              <ListItemIcon>
                <MapIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Store list" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={handleMenuOpen} color="inherit">
                    <Avatar sx={{ width: "35px", height: "35px" }} />
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
              </ListItemIcon>
              <ListItemText
                primary={userInfo.username}
                secondary={`role: ${userInfo.role}`}
              />
            </ListItem>
            {/* <ListItem>
            </ListItem> */}
          </List>
          <List>
            <ListItem>
              <ListItemText secondary={`Version: 2.0.0`} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default TopBar;
