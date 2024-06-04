import { useState, useContext, useRef, useEffect } from "react";
import { Button, Box } from "@mui/material";
import { ServerContext, StationContext, AuthContext } from "../../context";
import Layout from "../Layout";
import ItemDetails from "../ItemDetails";
import RetrieveBin from "../RetrieveBin";
import CustomeDialog from "../utils/CustomDialog";
import CustomSnackbar from "../utils/CustomSnackbar";

import axios from "axios";

const Retrieve = () => {
  const { SERVER_URL } = useContext(ServerContext);
  const { currentStation } = useContext(StationContext);
  const { userInfo } = useContext(AuthContext);

  const firstScanRef = useRef();
  const secondScanRef = useRef();

  const [isInputOne, setIsInputOne] = useState(true);
  const [isBtnStartDisplay, setIsBtnStartDisplay] = useState(true);

  const [layoutData, setLayoutData] = useState({});
  const [displayPigeonhole, setDisplayPigeonhole] = useState(false);
  const [pigeonhole, setPigeonhole] = useState("");
  const [soNumber, setSoNumber] = useState("");
  const [itemData, setItemData] = useState(null);
  const [bin, setBin] = useState("");
  const [dataSend, setDataSend] = useState([]);
  const [retrieveRack, setRetrieveRack] = useState({});
  const [greenPigeonhole, setGreenPigeonhole] = useState([]);
  const [greenBin, setGreenBin] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({});

  const [currRack, setCurrRack] = useState("");
  const [currSide, setCurrSide] = useState("");

  useEffect(() => {
    if (!userInfo) {
      console.log("User not logged in");
    }

    if (isInputOne) {
      document.addEventListener("keydown", handleFirstScan);
    } else {
      document.addEventListener("keydown", handleSecondScan);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("keydown", handleFirstScan);
      document.removeEventListener("keydown", handleSecondScan);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInputOne, pigeonhole, bin]);

  const handleStart = async () => {
    if (currentStation === "") {
      alert("Please select a station");
      return;
    } else {
      try {
        const response = await axios.get(
          `${SERVER_URL}/retrieve/get_retrieve?station_id=${currentStation[0].station_id}&user=${userInfo.id}`
        );

        if (response.data.message === "No item in pigeonhole") {
          setDialogOpen(true);
          setDialogMessage({
            title: "Error",
            content: "No item in pigeonhole",
          });
          return;
        }

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
        getGreenPigeonhole(
          Object.keys(response.data.pigeonhole[soNumber])[0].split("-")[0],
          Object.keys(response.data.pigeonhole[soNumber])[0].split("-")[1],
          soNumber
        );
        firstScanRef.current.focus();
      } catch (error) {
        console.error("Error retrieving order:", error);
        setDialogOpen(true);
        setDialogMessage({ title: "Error", content: "No item in pigeonhole" });
      }

      try {
        const response = await axios.get(
          `${SERVER_URL}/retrieve/get_ratrieve_rack?station_id=${currentStation[0].station_id}`
        );
        setRetrieveRack(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsBtnStartDisplay(false);
    }
  };

  const getGreenPigeonhole = async (rack, side, so_no) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/retrieve/get_green_pigeonhole?rack=${rack}&side=${side}&so_no=${so_no}`
      );
      console.log("Green pigeonhole:", response.data);
      setGreenPigeonhole(response.data);
    } catch (error) {
      console.log("Error getting green pigeonhole:", error);
    }
  };

  const handleFirstScan = async (event) => {
    if (event.key === "Enter") {
      console.log("Pigeonhole:", pigeonhole, greenPigeonhole);
      if (!greenPigeonhole.includes(pigeonhole)) {
        setDialogMessage({
          title: "Error",
          content: `Wrong pigeonhole(${pigeonhole})`,
        });
        setDialogOpen(true);
        setPigeonhole("");
        return;
      }

      try {
        const response = await axios.post(`${SERVER_URL}/retrieve/get_item`, {
          so_number: soNumber,
          pigeonhole: pigeonhole,
        });

        setItemData(response.data.items);
        secondScanRef.current.focus();
      } catch (error) {
        console.error("Error getting item:", error);
        setPigeonhole("");
      }

      try {
        const response = await axios.get(
          `${SERVER_URL}/retrieve/get_bin?so_no=${soNumber}`
        );
        setGreenBin(response.data);
        setIsInputOne(false);
      } catch (error) {
        console.log("Error getting bin:", error);
        setPigeonhole("");
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
        setDialogMessage({ title: "Error", content: `Wrong bin(${bin})` });
        setDialogOpen(true);
      } else {
        try {
          await axios.post(`${SERVER_URL}/retrieve/update_retrieve`, {
            dataSend: dataSend,
            so_number: soNumber,
            pigeonholeId: pigeonhole,
          });

          handleSuccess();
        } catch (error) {
          console.error("Error getting item:", error);
          setBin("");
        }
      }
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

  const handleSuccess = async () => {
    setDialogMessage({
      title: "Success",
      content: `Item retrieved {${pigeonhole}}`,
    });
    setDialogOpen(true);

    getGreenPigeonhole(currRack, currSide, soNumber);
    setGreenBin({});

    setItemData(null);

    setDialogMessage({});
    setDialogOpen(true);

    setIsInputOne(true);
    setBin("");
    setPigeonhole("");
  };

  const handleQuantitiesChange = (updatedQuantities) => {
    setDataSend(updatedQuantities);
    secondScanRef.current.focus();
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
    <>
      {isBtnStartDisplay && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleStart}
          style={{ height: "56px" }}
        >
          Start
        </Button>
      )}
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
              />
              <RetrieveBin
                row={retrieveRack.row}
                column={retrieveRack.column}
                greenBin={greenBin}
              />
            </>
          )}
        </>
      </Box>
      <input
        ref={firstScanRef}
        value={pigeonhole}
        type="text"
        onChange={() => {}}
        onKeyDown={handleFirstScan}
        style={{ display: "none" }}
      />
      <input
        ref={secondScanRef}
        value={bin}
        type="text"
        onChange={() => {}}
        onKeyDown={handleSecondScan}
        style={{ display: "none" }}
      />
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
      {dialogMessage.title == "Success" ? (
        <CustomSnackbar
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
          message={dialogMessage.content}
        />
      ) : (
        <CustomeDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
          onComplete={() => setDialogOpen(false)}
          message={dialogMessage}
        />
      )}
    </>
  );
};

export default Retrieve;
