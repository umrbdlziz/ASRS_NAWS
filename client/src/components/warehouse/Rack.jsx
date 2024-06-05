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

const Rack = ({ racks, handleDeleteBtn }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: "16px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rack ID</TableCell>
            <TableCell>Rack Pattern</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {racks.map((rack) => (
            <TableRow key={rack.rack_id}>
              <TableCell>{rack.rack_id}</TableCell>
              <TableCell>{rack.pattern}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteBtn("rack", rack.rack_id)}
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

Rack.propTypes = {
  racks: PropTypes.array,
  handleDeleteBtn: PropTypes.func,
};

export default Rack;
