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
import ItemDetails from "../components/ItemDetails";
import axios from "axios";

const RetrievePage = () => {
  const [stations, setStations] = useState([]);
  const [isStore, setIsStore] = useState(false);
  const [selectedStation, setSelectedStation] = useState("");
  const [layoutData, setLayoutData] = useState({});
  const [displayPigeonhole, setDisplayPigeonhole] = useState(false);
  const [greenPigeonhole, setGreenPigeonhole] = useState([]);
  const [pigeonhole, setPigeonhole] = useState("");
  const [soNumber, setSoNumber] = useState("");
  const [itemData, setItemData] = useState(null);
  const [showRetrieveBin, setShowRetrieveBin] = useState(false);
  const [bin, setBin] = useState("");
  const [dataSend, setDataSend] = useState([]);

  const firstScanRef = useRef();
  const secondScanRef = useRef();

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
        setSoNumber(Object.keys(response.data.pigeonhole)[0]);

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

  const handleFirstScan = async (event) => {
    if (event.key === "Enter") {
      console.log("First scan entered:", pigeonhole);
      setPigeonhole("");
      try {
        const response = await axios.post(`${SERVER_URL}/retrieve/get_item`, {
          so_number: soNumber,
          pigeonhole: pigeonhole,
        });

        setItemData(response.data.items);
        setShowRetrieveBin(true);
        secondScanRef.current.focus();
      } catch (error) {
        console.error("Error getting item:", error);
      }
    } else if (
      event.key !== "Shift" &&
      event.key !== "Tab" &&
      event.key !== "CapsLock" &&
      event.key !== "Alt"
    ) {
      setPigeonhole(pigeonhole + event.key);
    }
  };

  const handleSecondScan = async (event) => {
    if (event.key === "Enter") {
      console.log(bin, dataSend);
    } else if (
      event.key !== "Shift" &&
      event.key !== "Tab" &&
      event.key !== "CapsLock" &&
      event.key !== "Alt"
    ) {
      setBin(bin + event.key);
    }
  };

  const handleQuantitiesChange = (updatedQuantities) => {
    setDataSend(updatedQuantities);
    secondScanRef.current.focus();
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
        onKeyDown={handleFirstScan}
        style={{ position: "absolute", left: "-9999px" }}
      />
      <input
        ref={secondScanRef}
        type="text"
        onKeyDown={handleSecondScan}
        style={{ position: "absolute", left: "-9998px" }}
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
        <Box display="flex" justifyContent="space-between" marginTop={2}>
          <Box flex={1} marginRight={2}>
            <Layout
              data={layoutData}
              currSide="S1"
              greenPigeonhole={greenPigeonhole}
            />
          </Box>
          {itemData && (
            <ItemDetails
              itemData={itemData}
              onQuantitiesChange={handleQuantitiesChange}
            ></ItemDetails>
          )}
          {showRetrieveBin && (
            <Box flex={1}>
              <Typography variant="h6">Retrieve Bin</Typography>
              {/* Implement the retrieve bin details here */}
            </Box>
          )}
        </Box>
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
