import { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import * as XLSX from "xlsx";

import { ServerContext } from "../context";

const InventoryPage = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [inventory, setInventory] = useState([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertImport, setAlertImport] = useState(false);
  const [deleteAlertOrder, setDeleteAlertOrder] = useState(false);

  const columns = [
    { field: "item_code", headerName: "Item Code", width: 150 },
    { field: "item_desc", headerName: "Item Desc", width: 600 },
    { field: "item_image", headerName: "Image", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleDeleteOrder(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/item/get_all_items`);
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenImportDialog = () => {
    setImportDialogOpen(true);
  };

  const handleCloseImportDialog = () => {
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const result = await axios.delete(
        `${SERVER_URL}/retrieve/delete_order/${orderId}`
      );

      console.log(result.data.message);
      fetchOrders();
      setDeleteAlertOrder(true); // Show alert when user is deleted
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
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

          console.log(response.data.message);
          setAlertImport(true);
          handleCloseImportDialog();
          fetchOrders(); // Refresh the orders after upload
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };
    } else {
      alert("No file selected");
    }
  };

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenImportDialog}
          sx={{ mr: 2 }}
        >
          Import Inventory
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateDialog}
        >
          Create Inventory
        </Button>
      </Box>

      <DataGrid
        rows={inventory}
        columns={columns}
        getRowId={(row) => row.item_code}
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

      {/* Dialog for import Inventory */}
      <Dialog open={importDialogOpen} onClose={handleCloseImportDialog}>
        <DialogTitle>Import Inventory</DialogTitle>
        <DialogContent>
          <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
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
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create Inventory</DialogTitle>
        {/* Add your create Inventory form here */}
      </Dialog>

      <Snackbar
        open={alertImport}
        autoHideDuration={5000}
        onClose={() => setAlertImport(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlertImport(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          New list has been successfully added.
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleteAlertOrder}
        autoHideDuration={5000}
        onClose={() => setDeleteAlertOrder(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setDeleteAlertOrder(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          The item has been successfully deleted.
        </Alert>
      </Snackbar>
    </div>
  );
};

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

export default InventoryPage;
