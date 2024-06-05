import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
  Paper,
} from "@mui/material";
import PropTypes from "prop-types";

const Bin = ({ bins, handleDeleteBtn }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: "16px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bin ID</TableCell>
            <TableCell>Shipping Order</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Station</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bins.map((bin) => (
            <TableRow key={bin.bin_id}>
              <TableCell>{bin.bin_id}</TableCell>
              <TableCell>{bin.so_no}</TableCell>
              <TableCell>{bin.position}</TableCell>
              <TableCell>{bin.station_id}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteBtn("bin", bin.bin_id)}
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
  );
};

Bin.propTypes = {
  bins: PropTypes.array.isRequired,
  handleDeleteBtn: PropTypes.func.isRequired,
};

export default Bin;
