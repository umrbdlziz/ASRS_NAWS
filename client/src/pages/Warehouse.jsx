import { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ServerContext } from "../context";
import CustomeSnackbar from "../components/utils/CustomSnackbar";

const Warehouse = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({});
  const [patterns, setPatterns] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPattern, setCurrentPattern] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPattern = async () => {
      try {
        const fetchData = await axios.get(
          `${SERVER_URL}/warehouse/all_pattern`
        );
        setPatterns(fetchData.data);
      } catch (error) {
        console.log("Error in /all_pattern:", error);
      }
    };

    fetchPattern();
  }, [SERVER_URL, patterns]);

  const handleSavePattern = async () => {
    // Save the pattern to the database
    try {
      const saveData = await axios.post(`${SERVER_URL}/warehouse/add_pattern`, {
        pattern_id: currentPattern,
        pattern: "{}",
      });

      setOpenSnackbar(true);
      setMessage({
        message: `${saveData.data.changes} pattern added successfully`,
        severity: "success",
      });
      setCurrentPattern("");
      setPatterns([]);
    } catch (error) {
      console.log("Error in /add_pattern:", error);
    }
    setOpenDialog(false);
  };

  const handleDeletePattern = async (pattern) => {
    // Delete the pattern from the database
    try {
      const deleteData = await axios.delete(
        `${SERVER_URL}/warehouse/delete_pattern`,
        {
          data: { pattern },
        }
      );

      setOpenSnackbar(true);
      setMessage({
        message: `${deleteData.data.changes} pattern deleted successfully`,
        severity: "success",
      });
      setPatterns([]);
    } catch (error) {
      console.log("Error in /delete_pattern:", error);
    }
    // setPatterns((prevPatterns) => prevPatterns.filter((p) => p !== pattern));
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
      >
        Add New Pattern
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pattern ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patterns.map((pattern) => (
              <TableRow key={pattern.pattern_id}>
                <TableCell>{pattern.pattern_id}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      navigate(`/warehouse/edit/${pattern.pattern_id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeletePattern(pattern.pattern_id)}
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add new pattern</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of the new pattern.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Pattern Name"
            type="text"
            fullWidth
            value={currentPattern}
            onChange={(e) => setCurrentPattern(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSavePattern} color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
