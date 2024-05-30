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
import RetrieveBin from "../components/RetrieveBin";
import ScanDialog from "../components/ScanDialog";
import { Store } from "../components";
import axios from "axios";

const StationPage = () => {
  const [stations, setStations] = useState([]);
  const [isRetrieve, setIsRetrieve] = useState(true);
  const [selectedStation, setSelectedStation] = useState("");
  const [layoutData, setLayoutData] = useState({});
  const [displayPigeonhole, setDisplayPigeonhole] = useState(false);
  const [greenPigeonhole, setGreenPigeonhole] = useState([]);
  const [pigeonhole, setPigeonhole] = useState("");
  const [soNumber, setSoNumber] = useState("");
  const [itemData, setItemData] = useState(null);
  const [bin, setBin] = useState("");
  const [dataSend, setDataSend] = useState([]);
  const [retrieveRack, setRetrieveRack] = useState({});
  const [greenBin, setGreenBin] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(false);
  const [currRack, setCurrRack] = useState("");
  const [currSide, setCurrSide] = useState("");

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
      if (!isRetrieve) {
        console.log("Store");
      } else {
        try {
          const response = await axios.post(
            `${SERVER_URL}/retrieve/get_storage`,
            {
              station: selectedStation,
              action: isRetrieve ? "retrieve" : "store",
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

          setCurrRack(
            Object.keys(response.data.pigeonhole[soNumber])[0].split("-")[0]
          );
          setCurrSide(
            Object.keys(response.data.pigeonhole[soNumber])[0].split("-")[1]
          );

          // Set the array to setGreenPigeonhole
          setGreenPigeonhole(pigeonholeArray);
          firstScanRef.current.focus();
        } catch (error) {
          console.error("Error retrieving order:", error);
        }

        try {
          const response = await axios.get(
            `${SERVER_URL}/retrieve/get_ratrieve_rack?station_id=${selectedStation}`
          );
          setRetrieveRack(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleFirstScan = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await axios.post(`${SERVER_URL}/retrieve/get_item`, {
          so_number: soNumber,
          pigeonhole: pigeonhole,
        });

        setItemData(response.data.items);
        secondScanRef.current.focus();
      } catch (error) {
        console.error("Error getting item:", error);
      }

      try {
        const response = await axios.get(
          `${SERVER_URL}/retrieve/get_bin?so_no=${soNumber}`
        );
        setGreenBin(response.data);
      } catch (error) {
        console.log("Error getting bin:", error);
      }
    } else if (event.key === "Backspace") {
      setPigeonhole(pigeonhole.slice(0, -1));
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
      if (bin != greenBin.bin_id) {
        setDialogMessage(false);
        setDialogOpen(true);
      } else {
        try {
          const response = await axios.post(
            `${SERVER_URL}/retrieve/update_retrieve`,
            {
              dataSend: dataSend,
              so_number: soNumber,
              pigeonholeId: pigeonhole,
            }
          );

          console.log("Success:", response.data);
          setDialogMessage(true);
          setDialogOpen(true);
        } catch (error) {
          console.error("Error getting item:", error);
        }
      }
      setBin("");
      setPigeonhole("");
      firstScanRef.current.focus();
    } else if (event.key === "Backspace") {
      setBin(bin.slice(0, -1));
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
    setIsRetrieve(event.target.checked);
  };

  const handleNext = () => {
    // Logic for the Next button
    console.log("Next button clicked");
  };

  const handleComplete = () => {
    // Logic for the Complete button
    console.log("Complete button clicked");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRetry = () => {
    setDialogOpen(false);
    secondScanRef.current.focus();
  };

  const handleCompleteDialog = () => {
    setDialogOpen(false);
    firstScanRef.current.focus();
    setGreenBin({});
    setItemData(null);
  };

  return (
    <div style={{ margin: 10 }}>
      {/* hidden input */}
      <input
        ref={firstScanRef}
        type="text"
        value={pigeonhole}
        onKeyDown={handleFirstScan}
        onChange={() => {}}
        style={{ position: "absolute", left: "0px" }}
      />
      <input
        ref={secondScanRef}
        type="text"
        value={bin}
        onKeyDown={handleSecondScan}
        onChange={() => {}}
        style={{ position: "absolute", left: "1000px" }}
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
          checked={isRetrieve}
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
      {isRetrieve ? <div></div> : <Store />}
      <Box display="flex" justifyContent="space-between" marginX={2}>
        <>
          {displayPigeonhole && (
            <>
              <Box flex={1} marginRight={2}>
                <Layout
                  data={layoutData}
                  currRack={currRack}
                  currSide={currSide}
                  greenPigeonhole={greenPigeonhole}
                />
              </Box>
              <ItemDetails
                itemData={itemData}
                onQuantitiesChange={handleQuantitiesChange}
              ></ItemDetails>
              <RetrieveBin
                row={retrieveRack.row}
                column={retrieveRack.column}
                greenBin={greenBin}
              ></RetrieveBin>
            </>
          )}
        </>
      </Box>
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
      <ScanDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onRetry={handleRetry}
        onComplete={handleCompleteDialog}
        message={dialogMessage}
      />
    </div>
  );
};

export default StationPage;
