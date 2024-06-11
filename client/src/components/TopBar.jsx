import { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
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
  ListItemButton,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuIcon from "@mui/icons-material/Menu";
import StoreIcon from "@mui/icons-material/Store";
import MapIcon from "@mui/icons-material/Map";
import WarehouseIcon from "@mui/icons-material/Warehouse";

import { useNavigate } from "react-router-dom";
import { logout } from "./authService";
import { AuthContext, ServerContext, StationContext } from "../context";
import NanoIcon from "../assets/NanoIcon.png";
import axios from "axios";

const TopBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState("");
  const [stations, setStations] = useState([]);
  const [open, setOpen] = useState(false);

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

  const handleUserClick = async (page) => {
    if (page === "/logout") {
      console.log("Logging out");
      await logout();
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      setDrawerOpen(false);
      navigate(page);
    }
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
          // onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={() => handleUserClick("/")}>
              <ListItemIcon>
                <HomeIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Home Page" />
            </ListItem>
            <ListItem button onClick={() => handleUserClick("/station")}>
              <ListItemIcon>
                <StoreIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Station" />
            </ListItem>
            {/* <ListItem button onClick={() => handleUserClick("/map")}>
              <ListItemIcon>
                <MapIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Live Map" />
            </ListItem> */}
            <ListItem button onClick={() => handleUserClick("/inventory")}>
              <ListItemIcon>
                <InventoryIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Inventory list" />
            </ListItem>
            <ListItem button onClick={() => handleUserClick("/order_list")}>
              <ListItemIcon>
                <LocalShippingIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Order list" />
            </ListItem>
            <ListItem button onClick={() => handleUserClick("/store_list")}>
              <ListItemIcon>
                <FormatListBulletedIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Store list" />
            </ListItem>
            <ListItem button onClick={() => handleUserClick("/warehouse")}>
              <ListItemIcon>
                <WarehouseIcon style={{ color: "#EFF1ED" }} />
              </ListItemIcon>
              <ListItemText primary="Warehouse" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={() => setOpen(!open)}>
              <ListItemIcon>
                <Avatar sx={{ width: "35px", height: "35px" }} />
              </ListItemIcon>
              <ListItemText
                primary={userInfo.username}
                secondary={`role: ${userInfo.role}`}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  onClick={() => handleUserClick("/user")}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="User" />
                </ListItemButton>
                <ListItemButton
                  onClick={() => handleUserClick("/logout")}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </Collapse>
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
