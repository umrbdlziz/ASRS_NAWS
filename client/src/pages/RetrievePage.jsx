import { useState, useEffect, useContext, useRef } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Switch,
  Box,
} from "@mui/material";
import { ServerContext, AuthContext } from "../context";
import Layout from "../components/Layout";
import axios from "axios";

const RetrievePage = () => {
  const [stations, setStations] = useState([]);
  const [isStore, setIsStore] = useState(false);
  const [selectedStation, setSelectedStation] = useState("");
  const [layoutData, setLayoutData] = useState({});
  const [displayPigeonhole, setDisplayPigeonhole] = useState(false);
  const [greenPigeonhole, setGreenPigeonhole] = useState([]);
  const [itemCode, setItemCode] = useState("");

  const firstScanRef = useRef();
  const { SERVER_URL } = useContext(ServerContext);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    // Fetch stations from the server
    const fetchStations = async () => {
      try {
        const stationResponse = await axios.get(
          `${SERVER_URL}/setting/all_station`
        );

        setStations(stationResponse.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, [SERVER_URL]);

  const handleStart = async () => {
    if (selectedStation === "") {
      alert("Please select a station");
      return;
    } else {
      try {
        const response = await axios.post(
          `${SERVER_URL}/retrieve/get_storage`,
          {
            station: selectedStation,
            action: isStore ? "store" : "retrieve",
            user: userInfo.id,
          }
        );
        console.log(response.data);
        setLayoutData(response.data.layout);
        setDisplayPigeonhole(true);
        // Access the array values
        const soNumber = Object.keys(response.data.pigeonhole)[0];
        const rackSide = Object.keys(response.data.pigeonhole[soNumber])[0];
        const pigeonholeArray = response.data.pigeonhole[soNumber][rackSide];

        // Set the array to setGreenPigeonhole
        setGreenPigeonhole(pigeonholeArray);
        firstScanRef.current.focus();
      } catch (error) {
        console.error("Error retrieving order:", error);
      }
    }
  };

  const handleFirstScan = (event) => {
    if (event.key === "Enter") {
      console.log("First scan entered:", itemCode);
      setItemCode("");
    } else if (
      event.key !== "Shift" &&
      event.key !== "Tab" &&
      event.key !== "CapsLock"
    ) {
      setItemCode(itemCode + event.key);
    }
  };

  const handleSwitchChange = (event) => {
    setIsStore(event.target.checked);
  };

  const handleNext = () => {
    // Logic for the Next button
    console.log("Next button clicked");
  };

  const handleComplete = () => {
    // Logic for the Complete button
    console.log("Complete button clicked");
  };

  return (
    <div style={{ margin: 10 }}>
      {/* hidden input */}
      <input
        ref={firstScanRef}
        type="text"
        style={{ position: "absolute", left: "-9999px" }}
        onKeyDown={handleFirstScan}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginBottom={2}
      >
        <Typography variant="subtitle1" marginRight={1}>
          Store
        </Typography>
        <Switch
          checked={isStore}
          onChange={handleSwitchChange}
          color="primary"
        />
        <Typography variant="subtitle1" marginLeft={1}>
          Retrieve
        </Typography>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <TextField
          select
          label="Select Station"
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          margin="normal"
          style={{ flex: 1, marginRight: 16 }}
        >
          {stations.map((station) => (
            <MenuItem key={station.station_id} value={station.station_id}>
              {station.station_id}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handleStart}
          style={{ height: "56px" }}
        >
          Start
        </Button>
      </Box>
      {displayPigeonhole && (
        <Layout
          data={layoutData}
          currSide="S1"
          greenPigeonhole={greenPigeonhole}
        />
      )}
      <Box
        display="flex"
        justifyContent="flex-end"
        position="fixed"
        bottom={16}
        right={16}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleNext}
          style={{ marginRight: 16 }}
        >
          Next
        </Button>
        <Button variant="contained" color="primary" onClick={handleComplete}>
          Complete
        </Button>
      </Box>
    </div>
  );
};

export default RetrievePage;
