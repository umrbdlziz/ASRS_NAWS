import { useState, useEffect, useContext } from "react";
import { Button, Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import axios from "axios";

import { ServerContext } from "../context";
import CustomeSnackbar from "../components/utils/CustomSnackbar";
import {
  Pattern,
  Rack,
  Bin,
  RetrieveRack,
  AddDialog,
} from "../components/warehouse";

const Warehouse = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({});

  const [openDialog, setOpenDialog] = useState(false);
  const [newValue, setNewValue] = useState({
    id: "",
    pattern: "",
    row: "",
    column: "",
    position: "",
    soNo: "",
    station: "",
  });
  const [dialogMessage, setDialogMessage] = useState({
    title: "",
    content: "",
  });
  const [type, setType] = useState("");

  const [patterns, setPatterns] = useState([]);
  const [racks, setRacks] = useState([]);
  const [retrieveRacks, setRetrieveRacks] = useState([]);
  const [bins, setBins] = useState([]);
  const [soNo, setSoNo] = useState([]);
  const [station, setStation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          patternsData,
          racksData,
          retrieveRacksData,
          binsData,
          soNoData,
          stationData,
        ] = await Promise.all([
          axios.get(`${SERVER_URL}/warehouse/all_patterns`),
          axios.get(`${SERVER_URL}/warehouse/all_racks`),
          axios.get(`${SERVER_URL}/warehouse/all_retrieve_racks`),
          axios.get(`${SERVER_URL}/warehouse/all_bins`),
          axios.get(`${SERVER_URL}/retrieve/all_so_no`),
          axios.get(`${SERVER_URL}/setting/all_station`),
        ]);

        setPatterns(patternsData.data);
        setRacks(racksData.data);
        setRetrieveRacks(retrieveRacksData.data);
        setBins(binsData.data);
        setSoNo(soNoData.data);
        setStation(stationData.data);
      } catch (error) {
        console.log("Error in /all_patterns:", error);
      }
    };

    fetchData();
  }, [SERVER_URL, patterns, racks, retrieveRacks, bins]);

  const handleOnClick = (type) => {
    setType(type);

    switch (type) {
      case "pattern":
        setOpenDialog(true);
        setDialogMessage({
          title: "Add new Pattern",
          content: "Please input unique pattern Name",
        });
        break;
      case "rack":
        setOpenDialog(true);
        setDialogMessage({
          title: "Add new Rack",
          content: "Please input unique rack Name",
        });
        break;
      case "retrieveRack":
        setOpenDialog(true);
        setDialogMessage({
          title: "Add new Retrieve Rack",
          content: "Please input unique retrieve rack name",
        });
        break;
      case "bin":
        setOpenDialog(true);
        setDialogMessage({
          title: "Add new Retrieve Bin",
          content: "Please input unique retrieve bin name",
        });
        break;
      default:
        break;
    }
  };

  const handleSaveBtn = async () => {
    let data = {};
    if (type === "pattern") {
      data = {
        pattern_id: newValue.id,
        pattern: "{}",
      };
    } else if (type === "rack") {
      data = {
        rack_id: newValue.id,
        pattern_id: newValue.pattern,
      };
    } else if (type === "retrieveRack") {
      data = {
        retrieve_rack_id: newValue.id,
        row: newValue.row,
        column: newValue.column,
      };
    } else if (type === "bin") {
      data = {
        bin_id: newValue.id,
        so_no: newValue.soNo,
        position: newValue.position,
        station: newValue.station,
      };
    }

    // Save the pattern to the database
    try {
      const saveData = await axios.post(
        `${SERVER_URL}/warehouse/add_${type}`,
        data
      );

      setOpenSnackbar(true);
      setMessage({
        message: `${saveData.data.changes} ${type} added successfully`,
        severity: "success",
      });
      setNewValue({
        id: "",
        pattern: "",
        row: "",
        column: "",
        position: "",
        soNo: "",
        station: "",
      });
      setPatterns([]);
    } catch (error) {
      console.log("Error in /save btn:", error);
    }
    setOpenDialog(false);
  };

  const handleDeleteBtn = async (type, id) => {
    // Delete the pattern from the database
    try {
      const deleteData = await axios.delete(
        `${SERVER_URL}/warehouse/delete_${type}`,
        {
          data: { id },
        }
      );

      setOpenSnackbar(true);
      setMessage({
        message: `${deleteData.data.changes} ${type} deleted successfully`,
        severity: "success",
      });
      setPatterns([]);
    } catch (error) {
      console.log("Error in /delete:", error);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <Masonry columns={{ xs: 1, lg: 2 }} spacing={2}>
        <Box display="flex" flexDirection="column" paddingY={3}>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleOnClick("pattern")}
            sx={{ margin: "8px" }}
          >
            Add new Pattern
          </Button>
          <Pattern patterns={patterns} handleDeleteBtn={handleDeleteBtn} />
        </Box>
        <Box display="flex" flexDirection="column" paddingY={3}>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleOnClick("bin")}
            sx={{ margin: "8px" }}
          >
            Add new Bin
          </Button>
          <Bin bins={bins} handleDeleteBtn={handleDeleteBtn} />
        </Box>
        <Box display="flex" flexDirection="column" paddingY={3}>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleOnClick("rack")}
            sx={{ margin: "8px" }}
          >
            Add new Rack
          </Button>
          <Rack racks={racks} handleDeleteBtn={handleDeleteBtn} />
        </Box>
        <Box display="flex" flexDirection="column" paddingY={3}>
          <Button
            variant="contained"
            color="info"
            onClick={() => handleOnClick("retrieveRack")}
            sx={{ margin: "8px" }}
          >
            Add new Retrieve Rack
          </Button>
          <RetrieveRack
            retrieveRacks={retrieveRacks}
            handleDeleteBtn={handleDeleteBtn}
          />
        </Box>
      </Masonry>

      <AddDialog
        type={type}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onComplete={handleSaveBtn}
        dialogTitle={dialogMessage.title}
        dialogContent={dialogMessage.content}
        value={newValue}
        setValue={setNewValue}
        patterns={patterns}
        soNO={soNo}
        station={station}
      />

      <CustomeSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={message.message}
        severity={message.severity}
      />
    </div>
  );
};

export default Warehouse;
