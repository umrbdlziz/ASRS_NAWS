import { useState, useEffect, useContext, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import * as XLSX from "xlsx";

import { ServerContext } from "../context";
import ImageUpload from "../components/inventory/ImageUpload";
import CustomSnackbar from "../components/utils/CustomSnackbar";
import LoadingSpinner from "../components/utils/LoadingSpinner";

const InventoryPage = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [inventory, setInventory] = useState([]);
  const [totalQty, setTotalQty] = useState(0);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // create item state
  const [itemCode, setItemCode] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemImg, setItemImg] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  // image upload state
  const [imgDialog, setImgDialog] = useState(false);

  // custom snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    message: "",
    severity: "success",
  });

  const columns = [
    { field: "item_code", headerName: "Item Code", width: 150, editable: true },
    { field: "item_desc", headerName: "Item Desc", width: 600, editable: true },
    { field: "quantity", headerName: "Qty", width: 100 },
    { field: "item_img", headerName: "Image", width: 180, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteItem(params.row.item_code)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleEditItem(params.row)}
          >
            <SaveIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/item/get_all_items`);
      setInventory(response.data);
      setTotalQty(response.data.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  }, [setInventory, SERVER_URL]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenImportDialog = () => {
    setImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handleDeleteItem = async (item_code) => {
    try {
      const result = await axios.delete(
        `${SERVER_URL}/item/delete_item/${item_code}`
      );

      setSnackbarMessage({
        message: result.data.message,
        severity: "success",
      });
      setOpenSnackbar(true);
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleEditItem = async (data) => {
    try {
      const response = await axios.post(`${SERVER_URL}/item/update_item`, {
        item_code: data.item_code,
        item_desc: data.item_desc,
        item_img: data.item_img,
      });

      if (response.data.message !== "1 Item updated successfully") {
        setSnackbarMessage({
          message: "Error updating the item",
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
      fetchOrders();
    } catch (error) {
      console.error("Error editing item:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      handleCloseImportDialog();
      const reader = new FileReader();
      reader.readAsBinaryString(selectedFile);

      reader.onload = async (e) => {
        const data = e.target.result;

        // Parse the Excel data using xlsx library
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        excelData.shift(); // remove the first element
        try {
          const response = await axios.post(
            `${SERVER_URL}/item/add_item`,
            excelData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          setSnackbarMessage({
            message: response.data.message,
            severity: "success",
          });
          setOpenSnackbar(true);
          fetchOrders(); // Refresh the orders after upload
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          setIsLoading(false); // Set loading to false when the upload is done
        }
      };
    } else {
      alert("No file selected");
    }
  };

  const handleCreateItem = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/item/create_item`, {
        item_code: itemCode,
        item_desc: itemDesc,
        item_img: itemImg,
      });

      if (response.data.message === "Item already exists") {
        setErrorMessage(true);
        setSnackbarMessage({
          message: "Item already exists",
          severity: "error",
        });
        setOpenSnackbar(true);
        return;
      }

      fetchOrders();
      setSnackbarMessage({
        message: response.data.message,
        severity: "success",
      });
      setOpenSnackbar(true);
      setCreateDialogOpen(false);
      setErrorMessage(false);
      setItemCode("");
      setItemDesc("");
      setItemImg("");
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarDensitySelector color="secondary" />
        <GridToolbarExport color="secondary" />
        <Typography variant="body2" sx={{ flexGrow: 1 }} color="secondary">
          {totalQty} Quantity
        </Typography>
      </GridToolbarContainer>
    );
  };

  return (
    <div style={{ margin: "10px" }}>
      {isLoading ? (
        <LoadingSpinner text="IF THE FILE IS LARGE NEED MORE TIME TO UPLOAD" />
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="info"
              onClick={handleOpenImportDialog}
              sx={{ mr: 2 }}
            >
              Upload Inventory
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => setCreateDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              Create Inventory
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => setImgDialog(true)}
              sx={{ mr: 2 }}
            >
              Upload Images
            </Button>
          </Box>

          <Paper
            sx={{
              padding: "10px",
              height: "80vh",
            }}
          >
            <DataGrid
              rows={inventory}
              columns={columns}
              getRowId={(row) => row.item_code}
              sx={{ borderColor: "#192832" }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15,
                  },
                },
              }}
              pageSizeOptions={[15, 25, 50]}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </Paper>
          {/* Dialog for import Inventory */}
          <Dialog open={importDialogOpen} onClose={handleCloseImportDialog}>
            <DialogTitle>Import Inventory</DialogTitle>
            <DialogContent>
              <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseImportDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleFileUpload} color="secondary">
                Done
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for create Inventory */}
          <Dialog
            open={createDialogOpen}
            onClose={() => setCreateDialogOpen(false)}
          >
            <DialogTitle>Create Inventory</DialogTitle>
            <DialogContent>
              {errorMessage ? (
                <TextField
                  error
                  helperText="Item code already exist"
                  margin="dense"
                  label="Item Code"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                />
              ) : (
                <TextField
                  margin="dense"
                  label="Item Code"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                />
              )}
              <TextField
                label="Item Description"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
              />
              <TextField
                label="Image name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={itemImg}
                onChange={(e) => setItemImg(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setCreateDialogOpen(false)}
                color="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateItem} color="secondary">
                Done
              </Button>
            </DialogActions>
          </Dialog>

          {/** Image Upload Dialog */}
          <ImageUpload open={imgDialog} onClose={() => setImgDialog(false)} />

          <CustomSnackbar
            open={openSnackbar}
            onClose={() => setOpenSnackbar(false)}
            message={snackbarMessage.message}
            severity={snackbarMessage.severity}
          />
        </>
      )}
    </div>
  );
};

export default InventoryPage;
