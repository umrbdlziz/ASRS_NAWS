import { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";

import { ServerContext } from "../../context";
import CustomSnackbar from "../utils/CustomSnackbar";

const ImageUpload = ({ open, onClose }) => {
  const { SERVER_URL } = useContext(ServerContext);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    message: "",
    severity: "success",
  });

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setPreviews([...e.target.files].map((file) => URL.createObjectURL(file)));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${SERVER_URL}/item/upload_images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.message !== "Files uploaded successfully") {
        setSnackbarMessage({
          message: "Error uploading the files",
          severity: "error",
        });
        setOpenSnackbar(true);
        return;
      }
      setSnackbarMessage({
        message: response.data.message,
        severity: "success",
      });

      setOpenSnackbar(true);
      onClose();
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error("Error uploading the files:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Upload Images</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" color="primary" component="span">
              Choose Images
            </Button>
          </label>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt="Preview"
                style={{ width: "100px", marginTop: "10px" }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            color="secondary"
            variant="contained"
            disabled={!files.length}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage.message}
        severity={snackbarMessage.severity}
      />
    </>
  );
};

ImageUpload.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageUpload;
