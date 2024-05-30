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
    <>
      <input type="text" style={{ display: "none" }} />
      <TableContainer
        component={Paper}
        style={{ width: "400px", maxHeight: "350px", overflow: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storeList.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.item_desc}</TableCell>
                <TableCell>{item.item_quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {}}
                  >
                    Action
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

ListComponent.propTypes = {
  storeList: PropTypes.arrayOf(
    PropTypes.shape({
      item_desc: PropTypes.string,
      item_quantity: PropTypes.number,
      item_code: PropTypes.string, // Add item_code to the prop types
    })
  ),
};

export default ListComponent;
