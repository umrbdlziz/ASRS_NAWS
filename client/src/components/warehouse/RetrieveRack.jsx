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

const RetrieveRack = ({ retrieveRacks, handleDeleteBtn }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: "16px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Retrieve Rack ID</TableCell>
            <TableCell>Row</TableCell>
            <TableCell>Column</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {retrieveRacks.map((retrieveRack) => (
            <TableRow key={retrieveRack.retrieve_rack_id}>
              <TableCell>{retrieveRack.retrieve_rack_id}</TableCell>
              <TableCell>{retrieveRack.row}</TableCell>
              <TableCell>{retrieveRack.column}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    handleDeleteBtn(
                      "retrieveRack",
                      retrieveRack.retrieve_rack_id
                    )
                  }
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

RetrieveRack.propTypes = {
  retrieveRacks: PropTypes.array.isRequired,
  handleDeleteBtn: PropTypes.func.isRequired,
};

export default RetrieveRack;
