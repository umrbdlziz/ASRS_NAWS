import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const ListComponent = ({ storeList }) => {
  return (
    <TableContainer
      component={Paper}
      style={{ width: "400px", maxHeight: "350px", overflow: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Description</TableCell>
            <TableCell>Item Quantity</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {storeList.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.item_desc}</TableCell>
              <TableCell>{item.item_quantity}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary">
                  Action
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ListComponent.propTypes = {
  storeList: PropTypes.arrayOf(
    PropTypes.shape({
      item_desc: PropTypes.string.isRequired,
      item_quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ListComponent;
