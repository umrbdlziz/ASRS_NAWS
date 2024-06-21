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

const Station = ({ stations, handleDeleteBtn }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: "16px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Station ID</TableCell>
            <TableCell>X</TableCell>
            <TableCell>Y</TableCell>
            <TableCell>Z</TableCell>
            <TableCell>Yaw</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Retrieve Rack ID</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.station_id}>
              <TableCell>{station.station_id}</TableCell>
              <TableCell>{station.x}</TableCell>
              <TableCell>{station.y}</TableCell>
              <TableCell>{station.z}</TableCell>
              <TableCell>{station.yaw}</TableCell>
              <TableCell>{station.type}</TableCell>
              <TableCell>{station.retrieve_rack_id}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteBtn("station", station.station_id)}
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

Station.propTypes = {
  stations: PropTypes.array.isRequired,
  handleDeleteBtn: PropTypes.func.isRequired,
};

export default Station;
