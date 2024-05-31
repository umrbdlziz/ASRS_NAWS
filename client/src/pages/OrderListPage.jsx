import { useState, useEffect, useContext } from "react";
import * as XLSX from "xlsx";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
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
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

import { ServerContext } from "../context";
import CustomSnackbar from "../components/utils/CustomSnackbar";

const OrderStoreListPage = () => {
  const { SERVER_URL } = useContext(ServerContext);

  const [orders, setOrders] = useState([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [alertImport, setAlertImport] = useState(false);
  const [deleteAlertOrder, setDeleteAlertOrder] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({});

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    // { field: "customer", headerName: "Customer", width: 150 },
    { field: "so_no", headerName: "SO No.", width: 150 },
    // { field: "date", headerName: "Date", width: 150 },
    { field: "item_code", headerName: "Item Code", width: 150 },
    { field: "item_desc", headerName: "Item Description", width: 400 },
    { field: "item_quantity", headerName: "Qty", width: 100 },
    // { field: "uom", headerName: "UOM", width: 100 },
    { field: "status", headerName: "Status", width: 150 },
    // { field: "date_out", headerName: "Date Out", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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
      const response = await axios.get(`${SERVER_URL}/retrieve/all_orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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

        try {
          const response = await axios.post(
            `${SERVER_URL}/retrieve/add_order`,
            excelData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // console.log(response.data.message);
          if (response.data.message != "success") {
            setSnackbarMessage({
              message: response.data.message,
              severity: "error",
            });
          } else {
            setSnackbarMessage({
              message: "New list has been successfully added.",
              severity: "success",
            });
          }
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
          Import Order
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreateDialog}
        >
          Create Order
        </Button>
      </Box>

      {/* Dialog for import order */}
      <Dialog open={importDialogOpen} onClose={handleCloseImportDialog}>
        <DialogTitle>Import Order</DialogTitle>
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

      {/* Dialog for create order */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create Order</DialogTitle>
        {/* Add your create order form here */}
      </Dialog>

      <CustomSnackbar
        open={alertImport}
        onClose={() => setAlertImport(false)}
        message={snackbarMessage.message}
        severity={snackbarMessage.severity}
      />

      {/* <Snackbar
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
      </Snackbar> */}

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

      <DataGrid
        rows={orders}
        columns={columns}
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

export default OrderStoreListPage;
