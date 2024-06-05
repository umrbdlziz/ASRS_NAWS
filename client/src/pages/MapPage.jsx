import { useEffect, useState, useContext } from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import { Grid } from "@mui/material";
import L from "leaflet";
import io from "socket.io-client";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-rotatedmarker";

import { ServerContext } from "../context";
import arrowIcon from "../assets/arrow.png";
import { Task, MapEvents } from "../components/map";

const MapPage = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const [mapImage, setMapImage] = useState(null);
  const [robots, setRobots] = useState([]);
  const [imgXY, setImgXY] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState([
    [0, 0],
    [1000, 1000],
  ]);
  const [iconSize, setIconSize] = useState([30, 30]);

  useEffect(() => {
    const socket = io("http://192.168.1.48:5001"); // replace with your server URL

    socket.on("connect", () => {
      console.log(`Connected to server with id ${socket.id}`);
    });

    socket.on("tinyRobot_state", (message) => {
      // console.log("Received message:", message);
      setRobots(message.robots);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    const fetchMap = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/map/get_map`);
        setMapImage(response.data.map.levels[0].images[0].data); // Assuming response.data.map is the image URL or data
        console.log(response.data.map.levels[0]);
      } catch (error) {
        console.log("Error fetching map:", error.message);
      }
    };

    fetchMap();

    // Clean up the effect
    return () => socket.disconnect();
  }, [SERVER_URL]);

  useEffect(() => {
    const img = new Image();
    img.src = mapImage;
    img.onload = () => {
      setImgXY({ x: img.width, y: img.height });
      setBounds([
        [0, 0],
        [img.height, img.width],
      ]);
    };
  }, [mapImage]);

  const myIcon = L.icon({
    iconUrl: arrowIcon,
    iconSize: iconSize,
  });

  const robotMarkers = Object.values(robots).map((robot) => {
    const scale = 0.008465494960546494;
    const { x, y, yaw } = robot.location;
    const scaledX = x / scale;
    const scaledY = imgXY.y - y / -scale;

    const { name, status } = robot;

    return (
      <Marker
        key={`${name}-${yaw}`}
        position={[scaledY, scaledX]}
        icon={myIcon}
        rotationAngle={yaw * (180 / Math.PI) + 45} // rotate the marker
        rotationOrigin={"center center"} // rotate around the center
      >
        <Popup>
          <strong>{name}</strong>
          <br />
          Status: {status}
          <br />
          Battery: {robot.battery * 100}%
        </Popup>
      </Marker>
    );
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={9}>
        {mapImage ? (
          <MapContainer
            center={[0, 0]}
            zoom={-2}
            minZoom={-5}
            style={{ height: "80vh", width: "100%", margin: "20px" }}
            crs={L.CRS.Simple}
          >
            <ImageOverlay url={mapImage} bounds={bounds} />
            {robotMarkers}
            <MapEvents setIconSize={setIconSize} />
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </Grid>
      <Grid item xs={12} md={3}>
        <Task />
      </Grid>
    </Grid>
  );
};

export default MapPage;
